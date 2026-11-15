import {Paper, Stack, TextInput, PasswordInput, Button, Box, Title, Text} from '@mantine/core';
import { useState } from 'react';

export default function CrudAuth({rpc, onLogin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]=useState();

    async function submit(e) {
        e.preventDefault();

        setLoading(true);
        setError();
        try {
            await rpc.loginUsernameAndPassword(username,password);
            onLogin();
        }

        catch (e) {
            setError(e.message);
        }

        setLoading(false);
    }

    return (
        <Box bg="gray.1" mih="100vh" display="flex" p="md"
                style={{alignItems: 'center', justifyContent: 'center'}}>
            <Paper w={320} p="md" withBorder shadow="md">
                <form onSubmit={submit}>
                    <Stack>
                        <Title order={2} ta="center">
                            Admin
                        </Title>

                        <TextInput label="Username" required autoFocus
                                onFocus={e=>setError()}
                                value={username}
                                onChange={e => setUsername(e.currentTarget.value)}/>

                        <PasswordInput label="Password" required
                                onFocus={e=>setError()}
                                value={password}
                                onChange={e => setPassword(e.currentTarget.value)}/>

                        {error &&
                            <Text c="red" ta="center">{error}</Text>
                        }

                        <Button type="submit" loading={loading} fullWidth>
                            Log in
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
}
