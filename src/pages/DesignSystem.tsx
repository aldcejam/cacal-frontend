import { useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { GlassCard } from '../components/atoms/GlassCard';
import { Typography } from '../components/atoms/Typography';
import { Input } from '../components/atoms/Input';
import { MetricCard } from '../components/molecules/MetricCard';
import { PaymentCard } from '../components/molecules/PaymentCard';

import { Select } from '../components/atoms/Select';
import { Textarea } from '../components/atoms/Textarea';
import { Checkbox } from '../components/atoms/Checkbox';
import { Switch } from '../components/atoms/Switch';

// Using mock data for preview
const mockPayment = {
    id: "1",
    name: 'Nubank Roxinho',
    type: 'CREDIT_CARD' as const,
    relationType: 'BANK',
    relationName: 'Nubank'
};

const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
];

export default function DesignSystemPage() {
    const [toggle, setToggle] = useState(false);
    const [switchVal, setSwitchVal] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground p-8 space-y-12">
            <header className="mb-12">
                <Typography variant="h1" className="mb-2">Design System</Typography>
                <Typography variant="body-lg" className="text-muted-foreground">
                    Component library and style guide verification.
                </Typography>
            </header>

            {/* TYPOGRAPHY */}
            <section className="space-y-6">
                <div className="border-b border-border pb-2">
                    <Typography variant="h2">Typography</Typography>
                </div>
                <div className="grid gap-4">
                    <Typography variant="h1">Heading 1 - The quick brown fox</Typography>
                    <Typography variant="h2">Heading 2 - The quick brown fox</Typography>
                    <Typography variant="h3">Heading 3 - The quick brown fox</Typography>
                    <Typography variant="h4">Heading 4 - The quick brown fox</Typography>
                    <Typography variant="body-lg">Body Large - The quick brown fox jumps over the lazy dog.</Typography>
                    <Typography variant="body-base">Body Base - The quick brown fox jumps over the lazy dog.</Typography>
                    <Typography variant="body-sm">Body Small - The quick brown fox jumps over the lazy dog.</Typography>
                    <Typography variant="body-xs">Body XS - The quick brown fox jumps over the lazy dog.</Typography>
                </div>
            </section>

            {/* COLORS & SHADOWS */}
            <section className="space-y-6">
                <div className="border-b border-border pb-2">
                    <Typography variant="h2">Colors & Shadows</Typography>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="w-24 h-24 rounded-lg bg-primary shadow-sm flex items-center justify-center text-xs text-primary-foreground">Primary</div>
                    <div className="w-24 h-24 rounded-lg bg-secondary shadow-md flex items-center justify-center text-xs text-secondary-foreground">Secondary</div>
                    <div className="w-24 h-24 rounded-lg bg-destructive shadow-lg flex items-center justify-center text-xs text-destructive-foreground">Destructive</div>
                    <div className="w-24 h-24 rounded-lg bg-card shadow-xl flex items-center justify-center text-xs border border-border">Card Lv1</div>
                    <div className="w-24 h-24 rounded-lg bg-popover shadow-2xl flex items-center justify-center text-xs border border-border">Popover Lv2</div>
                </div>
            </section>

            {/* BUTTONS */}
            <section className="space-y-6">
                <div className="border-b border-border pb-2">
                    <Typography variant="h2">Buttons</Typography>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="primary" disabled>Disabled</Button>

                    <div className="w-full h-px bg-transparent my-2"></div>

                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>

                    <div className="w-full h-px bg-transparent my-2"></div>

                    <Button leftIcon={<span>←</span>}>Left Icon</Button>
                    <Button rightIcon={<span>→</span>}>Right Icon</Button>
                </div>
            </section>

            {/* BADGES */}
            <section className="space-y-6">
                <div className="border-b border-border pb-2">
                    <Typography variant="h2">Badges</Typography>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="outline">Outline</Badge>
                </div>
            </section>

            {/* FORM ATOMS */}
            <section className="space-y-6">
                <div className="border-b border-border pb-2">
                    <Typography variant="h2">Form Atoms</Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="space-y-4">
                        <Typography variant="h3">Inputs</Typography>
                        <Input placeholder="Default Input" />
                        <Input label="Email Address" placeholder="name@example.com" />
                        <Input label="With Left Icon" leftIcon={<span>@</span>} placeholder="Username" />
                        <Input label="With Right Icon" rightIcon={<span>?</span>} placeholder="Search..." />
                        <Input label="Error State" error="Invalid email address" defaultValue="invalid-email" />
                        <Input label="Disabled" disabled defaultValue="Cannot edit this" />
                    </div>

                    {/* Select & Textarea */}
                    <div className="space-y-4">
                        <Typography variant="h3">Select & Textarea</Typography>
                        <Select label="Simple Select" options={selectOptions} />
                        <Select label="Select with Icon" leftIcon={<span>☰</span>} options={selectOptions} />
                        <Textarea label="Bio" placeholder="Tell us about yourself" />
                        <Textarea label="With Helper" placeholder="Type here..." helperText="Max 500 characters" />
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                        <Typography variant="h3">Toggles</Typography>
                        <div className="flex flex-col gap-4">
                            <Checkbox label="Accept terms and conditions" />
                            <Checkbox label="Subscribe to newsletter" defaultChecked />
                            <Switch label="Dark Mode" checked={switchVal} onChange={(e) => setSwitchVal(e.target.checked)} />
                            <Switch label="Notifications" defaultChecked />
                        </div>
                    </div>
                </div>
            </section>

            {/* MOLECULES */}
            <section className="space-y-6">
                <div className="border-b border-border pb-2">
                    <Typography variant="h2">Molecules</Typography>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GlassCard>
                        <Typography variant="h3">Glass Card</Typography>
                        <Typography className="text-muted-foreground mt-2">
                            This is a standard glass card component with backdrop blur and border.
                        </Typography>
                    </GlassCard>

                    <MetricCard
                        title="Total Revenue"
                        value="$45,231.89"
                        subtitle="+20.1% from last month"
                        variant="primary"
                        icon={<span>$</span>}
                    />

                    <MetricCard
                        title="Active Users"
                        value="+2350"
                        subtitle="+180.1% from last month"
                        variant="default"
                        icon={<span>U</span>}
                    />

                    <div className="col-span-full md:col-span-2 lg:col-span-1">
                        <PaymentCard
                            payment={mockPayment as any}
                            isSelected={toggle}
                            onClick={() => setToggle(!toggle)}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
