'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
} from '@mantine/core';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Что-то пошло не так');
    }
    setLoading(false);
  }

  return (
    <Container size={400} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" w="100%">
        <Stack gap="md">
          <div>
            <Title order={2}>Мысли в урну</Title>
            <Text c="dimmed" size="sm">Введите email для входа</Text>
          </div>
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <TextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <Text c="red" size="sm">{error}</Text>}
              <Button type="submit" fullWidth loading={loading}>
                Получить код
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
