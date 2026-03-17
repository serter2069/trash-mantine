'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
} from '@mantine/core';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    if (res.ok) {
      router.push('/app');
    } else {
      const data = await res.json();
      setError(data.error || 'Неверный код');
    }
    setLoading(false);
  }

  return (
    <Container size={400} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" w="100%">
        <Stack gap="md">
          <div>
            <Title order={2}>Введите код</Title>
            <Text c="dimmed" size="sm">
              Код отправлен на {email}. (Подсказка: всегда <strong>1234</strong>)
            </Text>
          </div>
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput
                label="4-значный код"
                placeholder="1234"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              {error && <Text c="red" size="sm">{error}</Text>}
              <Button type="submit" fullWidth loading={loading}>
                Войти
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
