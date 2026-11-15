
import {Paper, Stack, TextInput, PasswordInput, Button, Box, Title} from '@mantine/core';
import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    try {
      await onLogin({ username, password });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      bg="gray.1"
      mih="100vh"
      display="flex"
      style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}
      p="md"
    >
      <Paper w={320} p="md" withBorder shadow="md">
        <form onSubmit={submit}>
          <Stack>
            <Title order={2} ta="center">
              Admin
            </Title>

            <TextInput
              label="Username"
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
              required
              autoFocus
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
              required
            />

            <Button type="submit" loading={loading} fullWidth>
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
