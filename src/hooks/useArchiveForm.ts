import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getMemory,
  toIsoDate,
  toKoreanDate,
  uploadMemoryImages,
} from '@/apis/momento';
import { useSaveMemory } from '@/hooks/useMomentoMutations';
import { parseKoreanDate } from '@/utils/dates';
import {
  MAX_MEMORY_PHOTOS,
  prepareArchivePhotos,
  resolveArchiveImageKeys,
  type ArchivePhoto,
} from '@/utils/archivePhotos';
import { showToast, useToastStore } from '@/stores/useToastStore';

type Field = 'name' | 'date' | 'content';

export function useArchiveForm() {
  const { archiveId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(archiveId);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<ArchivePhoto[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    name: false,
    date: false,
    content: false,
  });
  const submitting = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const saveMemory = useSaveMemory(archiveId);
  const memoryQuery = useQuery({
    queryKey: ['memory', archiveId],
    queryFn: () => getMemory(Number(archiveId)),
    enabled: editing,
    retry: false,
  });

  useEffect(() => {
    const item = memoryQuery.data;
    if (!item) return;
    setName(item.title);
    setDate(toKoreanDate(item.memoryDate));
    setContent(item.content);
    setPhotos(
      item.images.map((image) => ({
        id: image.imageKey,
        previewUrl: image.imageUrl,
        imageKey: image.imageKey,
      })),
    );
  }, [memoryQuery.data]);

  const errors = {
    name: !name.trim() ? '아카이브 이름을 입력해 주세요.' : '',
    date: !parseKoreanDate(date) ? '날짜를 선택해 주세요.' : '',
    content: !content.trim() ? '추억 내용을 입력해 주세요.' : '',
  };
  const busy = saving || preparing || (editing && memoryQuery.isPending);
  const canSave =
    !busy &&
    photos.length > 0 &&
    !Object.values(errors).some(Boolean) &&
    (!editing || memoryQuery.isSuccess);
  const touch = (field: Field) =>
    setTouched((current) => ({ ...current, [field]: true }));
  const notifyMissingPhotos = () => showToast('사진을 등록해주세요', 3000);

  const save = async () => {
    if (busy || submitting.current) return;
    if (!canSave) {
      setTouched({ name: true, date: true, content: true });
      if (!photos.length) notifyMissingPhotos();
      return;
    }
    submitting.current = true;
    setSaving(true);
    setError('');
    try {
      const files = photos.flatMap((photo) => (photo.file ? [photo.file] : []));
      const uploaded = await uploadMemoryImages(files);
      await saveMemory.mutateAsync({
        title: name.trim(),
        content: content.trim(),
        memoryDate: toIsoDate(date),
        imageKeys: resolveArchiveImageKeys(photos, uploaded),
      });
      navigate(archiveId ? `/archives/${archiveId}` : '/archives');
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length || busy || submitting.current) return;
    const available = Math.max(0, MAX_MEMORY_PHOTOS - photos.length);
    const selected = Array.from(files).slice(0, available);
    if (!selected.length) return;
    setPreparing(true);
    setError('');
    try {
      const prepared = await prepareArchivePhotos(selected);
      setPhotos((current) =>
        [...current, ...prepared].slice(0, MAX_MEMORY_PHOTOS),
      );
      useToastStore.getState().hide();
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setPreparing(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const closeCalendar = () => {
    touch('date');
    setCalendarOpen(false);
  };
  return {
    editing,
    name,
    date,
    content,
    photos,
    busy,
    canSave,
    calendarOpen,
    selectedImage,
    fileInput,
    error: error || memoryQuery.error?.message,
    helpers: {
      name: touched.name ? errors.name : '',
      date: touched.date ? errors.date : '',
      content: touched.content ? errors.content : '',
    },
    save,
    addPhotos,
    touch,
    closeCalendar,
    changeName: (value: string) => {
      setName(value);
      touch('name');
    },
    changeContent: (value: string) => {
      setContent(value);
      touch('content');
    },
    openCalendar: () => setCalendarOpen(true),
    selectDate: (value: string) => {
      setDate(value);
      closeCalendar();
    },
    selectImage: setSelectedImage,
    clearPhotos: () => {
      setPhotos([]);
      setSelectedImage(null);
    },
    deletePhoto: (index: number) => {
      setPhotos((current) =>
        current.filter((_, position) => position !== index),
      );
      setSelectedImage(null);
    },
    makeCover: (index: number) => {
      setPhotos((current) => [
        current[index],
        ...current.filter((_, position) => position !== index),
      ]);
      setSelectedImage(0);
    },
  };
}
