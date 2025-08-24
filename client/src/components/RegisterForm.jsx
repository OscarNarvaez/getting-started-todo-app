import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const options = {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/users', options)
            .then(async (res) => {
                if (res.status === 201) {
                    const data = await res.json();
                    setSuccess('Registered successfully');
                    setEmail('');
                    setPassword('');
                } else {
                    const body = await res.json().catch(() => ({}));
                    setError(body.error || 'Registration failed');
                }
            })
            .catch(() => setError('Network error'))
            .finally(() => setSubmitting(false));
    };

    return (
        <Form onSubmit={submit} className="mb-4">
            <InputGroup className="mb-2">
                <Form.Control
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    required
                />
            </InputGroup>
            <InputGroup className="mb-2">
                <Form.Control
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password (min 6 chars)"
                    aria-label="Password"
                    required
                />
            </InputGroup>
            {error && <div className="text-danger mb-2">{error}</div>}
            {success && <div className="text-success mb-2">{success}</div>}
            <Button type="submit" variant="primary" disabled={submitting || !email || !password}>
                {submitting ? 'Registering...' : 'Register'}
            </Button>
        </Form>
    );
}

RegisterForm.propTypes = {};
