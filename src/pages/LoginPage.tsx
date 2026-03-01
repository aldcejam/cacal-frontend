import { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../api/api';
import { useAuthStore } from '../stores/useAuthStore';

const { Title, Text } = Typography;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await api.auth.login({
                body: { email: values.email, password: values.password },
            });
            if (response?.user && response?.access_token) {
                login(response.user, response.access_token);
                toast.success('Login efetuado com sucesso!');
                navigate('/');
            } else {
                toast.error('Resposta inválida do servidor.');
            }
        } catch {
            // erros HTTP já tratados pelo interceptor do gerarService
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-background, #0a0a0a)',
        }} className="bg-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />

            <Card
                className="w-full max-w-md shadow-2xl relative z-10"
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '8px 0',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 mb-6 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
                        <div className="w-7 h-7 bg-white rounded-full opacity-90 shadow-inner relative z-10" />
                    </div>
                    <Title level={3} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>MinhasContas</Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>Faça login para continuar</Text>
                </div>

                <Form
                    name="login"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Por favor, insira seu e-mail!' },
                            { type: 'email', message: 'E-mail inválido!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-muted-foreground mr-1" />}
                            placeholder="Seu e-mail"
                            style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-muted-foreground mr-1" />}
                            placeholder="Sua senha"
                            style={{
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px'
                            }}
                        />
                    </Form.Item>

                    <div className="text-right mb-6 -mt-2">
                        <a href="#" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            style={{
                                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: 600,
                                boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.39)'
                            }}
                        >
                            Entrar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
