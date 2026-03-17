'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppShell,
  Container,
  Title,
  Text,
  Textarea,
  Button,
  Stack,
  Card,
  Group,
  Loader,
} from '@mantine/core';

interface Thought {
  id: number;
  text: string;
  created_at: string;
}

export default function AppPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadThoughts = useCallback(async (p: number) => {
    setLoading(true);
    const res = await fetch(`/api/thoughts?page=${p}`);
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    setThoughts(data.thoughts);
    setTotal(data.total);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadThoughts(page);
  }, [page, loadThoughts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);

    const res = await fetch('/api/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (res.status === 401) {
      router.push('/login');
      return;
    }

    if (res.ok) {
      setText('');
      setPage(1);
      await loadThoughts(1);
    }
    setSubmitting(false);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const totalPages = Math.ceil(total / 20);
  const thoughtsWord = total === 1 ? 'мысль' : total >= 2 && total <= 4 ? 'мысли' : 'мыслей';

  return (
    <AppShell
      header={{ height: 56 }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="sm" h="100%" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title order={3}>Мысли в урну</Title>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Выйти
          </Button>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm">
          <Stack gap="lg" mt="md">
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <form onSubmit={handleSubmit}>
                <Stack gap="sm">
                  <Textarea
                    placeholder="Напишите негативную мысль..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    resize="none"
                  />
                  <Button type="submit" fullWidth loading={submitting} disabled={!text.trim()}>
                    Выбросить
                  </Button>
                </Stack>
              </form>
            </Card>

            <Title order={4}>
              История ({total} {thoughtsWord})
            </Title>

            {loading ? (
              <Group justify="center"><Loader size="sm" /></Group>
            ) : thoughts.length === 0 ? (
              <Text c="dimmed" size="sm">Пока пусто. Выбросьте первую мысль.</Text>
            ) : (
              thoughts.map((t) => (
                <Card key={t.id} shadow="xs" p="md" radius="md" withBorder>
                  <Text size="xs" c="dimmed" mb={6}>
                    {new Date(t.created_at).toLocaleString('ru-RU')}
                  </Text>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{t.text}</Text>
                </Card>
              ))
            )}

            {totalPages > 1 && (
              <Group justify="space-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Назад
                </Button>
                <Text size="sm" c="dimmed">{page} / {totalPages}</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Вперёд
                </Button>
              </Group>
            )}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
