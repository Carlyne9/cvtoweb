'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { Modal } from '@/components/ui/Modal';
import { Upload, ArrowRight, Trash2, Plus, Check, Search, Mail, User, Lock, Globe } from 'lucide-react';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans">
      <div className="max-w-5xl mx-auto px-8 py-16 space-y-24">

        {/* Header */}
        <div>
          <p className="text-[var(--text-brand)] text-sm font-semibold uppercase tracking-widest mb-3">CVtoWeb</p>
          <h1 className="text-5xl font-bold mb-4">Design System</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Living style guide — colors, tokens, and components.
          </p>
        </div>

        {/* ── BRAND PALETTE ─────────────────────────────────── */}
        <section>
          <SectionLabel>Brand Palette</SectionLabel>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Primary violet scale — oklch(* * 278.887°)
          </p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[
              { name: '50',  token: '--brand-50' },
              { name: '100', token: '--brand-100' },
              { name: '200', token: '--brand-200' },
              { name: '300', token: '--brand-300' },
              { name: '400', token: '--brand-400' },
              { name: '600', token: '--brand-600' },
              { name: '700', token: '--brand-700' },
              { name: '800', token: '--brand-800' },
              { name: '900', token: '--brand-900' },
              { name: '950', token: '--brand-950' },
            ].map(({ name, token }) => (
              <ColorSwatch key={name} label={name} cssVar={token} />
            ))}
          </div>
        </section>

        {/* ── NEUTRAL PALETTE ───────────────────────────────── */}
        <section>
          <SectionLabel>Neutral Palette</SectionLabel>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Violet-tinted grays — same hue, near-zero chroma
          </p>
          <div className="grid grid-cols-5 md:grid-cols-13 gap-2">
            {[
              { name: '0',    token: '--neutral-0' },
              { name: '50',   token: '--neutral-50' },
              { name: '100',  token: '--neutral-100' },
              { name: '200',  token: '--neutral-200' },
              { name: '300',  token: '--neutral-300' },
              { name: '400',  token: '--neutral-400' },
              { name: '500',  token: '--neutral-500' },
              { name: '600',  token: '--neutral-600' },
              { name: '700',  token: '--neutral-700' },
              { name: '800',  token: '--neutral-800' },
              { name: '900',  token: '--neutral-900' },
              { name: '950',  token: '--neutral-950' },
              { name: '1000', token: '--neutral-1000' },
            ].map(({ name, token }) => (
              <ColorSwatch key={name} label={name} cssVar={token} />
            ))}
          </div>
        </section>

        {/* ── SEMANTIC COLORS ───────────────────────────────── */}
        <section>
          <SectionLabel>Semantic Colors</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <SemanticScale
              label="Success"
              hue="145°"
              swatches={[
                { name: '100', token: '--success-100' },
                { name: '400', token: '--success-400' },
                { name: '500', token: '--success-500' },
                { name: '600', token: '--success-600' },
                { name: '900', token: '--success-900' },
              ]}
            />
            <SemanticScale
              label="Error"
              hue="25°"
              swatches={[
                { name: '100', token: '--error-100' },
                { name: '400', token: '--error-400' },
                { name: '500', token: '--error-500' },
                { name: '600', token: '--error-600' },
                { name: '900', token: '--error-900' },
              ]}
            />
            <SemanticScale
              label="Warning"
              hue="75°"
              swatches={[
                { name: '100', token: '--warning-100' },
                { name: '400', token: '--warning-400' },
                { name: '500', token: '--warning-500' },
                { name: '600', token: '--warning-600' },
                { name: '900', token: '--warning-900' },
              ]}
            />
            <SemanticScale
              label="Info"
              hue="220°"
              swatches={[
                { name: '100', token: '--info-100' },
                { name: '400', token: '--info-400' },
                { name: '500', token: '--info-500' },
                { name: '600', token: '--info-600' },
                { name: '900', token: '--info-900' },
              ]}
            />
          </div>
        </section>

        {/* ── ROLE TOKENS ───────────────────────────────────── */}
        <section>
          <SectionLabel>Role Tokens</SectionLabel>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            Semantic aliases — components reference these, never raw palette values.
          </p>

          <div className="space-y-10">
            {/* Backgrounds */}
            <TokenGroup label="Backgrounds">
              <TokenRow token="--bg-base"         label="Base"          description="Page background" />
              <TokenRow token="--bg-subtle"        label="Subtle"        description="Panels, sidebars" />
              <TokenRow token="--bg-surface"       label="Surface"       description="Cards, modals" />
              <TokenRow token="--bg-elevated"      label="Elevated"      description="Dropdowns, tooltips" />
              <TokenRow token="--bg-overlay"       label="Overlay"       description="Hover states" />
              <TokenRow token="--bg-brand"         label="Brand"         description="Primary button fill" />
              <TokenRow token="--bg-brand-subtle"  label="Brand Subtle"  description="Tinted brand area" />
              <TokenRow token="--bg-brand-muted"   label="Brand Muted"   description="Very subtle brand wash" />
            </TokenGroup>

            {/* Borders */}
            <TokenGroup label="Borders">
              <TokenRow token="--border-subtle"  label="Subtle"  description="Lightest dividers" />
              <TokenRow token="--border-default" label="Default" description="Standard borders" />
              <TokenRow token="--border-strong"  label="Strong"  description="Prominent borders" />
              <TokenRow token="--border-brand"   label="Brand"   description="Focused / active borders" />
            </TokenGroup>

            {/* Text */}
            <TokenGroup label="Text">
              <TokenRow token="--text-primary"      label="Primary"       description="Main body text" />
              <TokenRow token="--text-secondary"    label="Secondary"     description="Supporting text" />
              <TokenRow token="--text-muted"        label="Muted"         description="Placeholders, hints" />
              <TokenRow token="--text-disabled"     label="Disabled"      description="Disabled states" />
              <TokenRow token="--text-brand"        label="Brand"         description="Brand-colored text" />
              <TokenRow token="--text-brand-subtle" label="Brand Subtle"  description="Softer brand text" />
              <TokenRow token="--text-success"      label="Success"       description="Success messages" />
              <TokenRow token="--text-error"        label="Error"         description="Error messages" />
              <TokenRow token="--text-warning"      label="Warning"       description="Warning messages" />
              <TokenRow token="--text-info"         label="Info"          description="Informational text" />
            </TokenGroup>

            {/* Interactive */}
            <TokenGroup label="Interactive">
              <TokenRow token="--interactive-primary"          label="Primary"           description="Primary button" />
              <TokenRow token="--interactive-primary-hover"    label="Primary Hover"     description="Primary button hover" />
              <TokenRow token="--interactive-primary-active"   label="Primary Active"    description="Primary button active" />
              <TokenRow token="--interactive-secondary"        label="Secondary"         description="Secondary button" />
              <TokenRow token="--interactive-secondary-hover"  label="Secondary Hover"   description="Secondary button hover" />
              <TokenRow token="--interactive-ghost-hover"      label="Ghost Hover"       description="Ghost / text button hover" />
            </TokenGroup>
          </div>
        </section>

        {/* ── TYPOGRAPHY ───────────────────────────────────── */}
        <section>
          <SectionLabel>Typography</SectionLabel>
          <p className="text-[var(--text-muted)] text-sm mb-10">
            Typeface: <span className="font-semibold text-[var(--text-secondary)]">Source Sans 3</span> · Scale: Major Third (1.25) · Base: 16px
          </p>

          <div className="space-y-2">

            {/* Display */}
            <TypeRow
              label="Display"
              usage="Hero / landing"
              spec="72px · 300 · lh 1.05 · ls -0.03em"
              style={{
                fontSize: 'var(--type-display-size)',
                fontWeight: 'var(--type-display-weight)',
                lineHeight: 'var(--type-display-lh)',
                letterSpacing: 'var(--type-display-ls)',
              }}
              sample="Build your portfolio."
            />

            {/* H1–H6 */}
            <TypeRow label="H1" usage="Page title" spec="56px · 600 · lh 1.1 · ls -0.02em"
              style={{ fontSize: 'var(--type-h1-size)', fontWeight: 'var(--type-h1-weight)', lineHeight: 'var(--type-h1-lh)', letterSpacing: 'var(--type-h1-ls)' }}
              sample="Upload your CV"
            />
            <TypeRow label="H2" usage="Section heading" spec="40px · 700 · lh 1.15 · ls -0.02em"
              style={{ fontSize: 'var(--type-h2-size)', fontWeight: 'var(--type-h2-weight)', lineHeight: 'var(--type-h2-lh)', letterSpacing: 'var(--type-h2-ls)' }}
              sample="Your experience"
            />
            <TypeRow label="H3" usage="Sub-section" spec="32px · 600 · lh 1.2 · ls -0.01em"
              style={{ fontSize: 'var(--type-h3-size)', fontWeight: 'var(--type-h3-weight)', lineHeight: 'var(--type-h3-lh)', letterSpacing: 'var(--type-h3-ls)' }}
              sample="Senior Designer"
            />
            <TypeRow label="H4" usage="Card heading" spec="24px · 600 · lh 1.3 · ls -0.01em"
              style={{ fontSize: 'var(--type-h4-size)', fontWeight: 'var(--type-h4-weight)', lineHeight: 'var(--type-h4-lh)', letterSpacing: 'var(--type-h4-ls)' }}
              sample="Acme Corporation"
            />
            <TypeRow label="H5" usage="Widget title" spec="20px · 600 · lh 1.35 · ls 0"
              style={{ fontSize: 'var(--type-h5-size)', fontWeight: 'var(--type-h5-weight)', lineHeight: 'var(--type-h5-lh)', letterSpacing: 'var(--type-h5-ls)' }}
              sample="Key skills"
            />
            <TypeRow label="H6" usage="List header" spec="18px · 600 · lh 1.4 · ls 0"
              style={{ fontSize: 'var(--type-h6-size)', fontWeight: 'var(--type-h6-weight)', lineHeight: 'var(--type-h6-lh)', letterSpacing: 'var(--type-h6-ls)' }}
              sample="Contact details"
            />

            {/* Subheadings */}
            <TypeRow label="Subheading LG" usage="Section label" spec="16px · 600 · lh 1.4 · ls 0.01em"
              style={{ fontSize: 'var(--type-subheading-lg-size)', fontWeight: 'var(--type-subheading-lg-weight)', lineHeight: 'var(--type-subheading-lg-lh)', letterSpacing: 'var(--type-subheading-lg-ls)' }}
              sample="About me"
            />
            <TypeRow label="Subheading SM" usage="Eyebrow / ALL CAPS" spec="12px · 700 · lh 1.4 · ls 0.08em"
              style={{ fontSize: 'var(--type-subheading-sm-size)', fontWeight: 'var(--type-subheading-sm-weight)', lineHeight: 'var(--type-subheading-sm-lh)', letterSpacing: 'var(--type-subheading-sm-ls)', textTransform: 'uppercase' }}
              sample="Experience"
            />

            {/* Body */}
            <TypeRow label="Body LG" usage="Long-form reading" spec="18px · 400 · lh 1.7 · ls 0"
              style={{ fontSize: 'var(--type-body-lg-size)', fontWeight: 'var(--type-body-lg-weight)', lineHeight: 'var(--type-body-lg-lh)', letterSpacing: 'var(--type-body-lg-ls)' }}
              sample="Transform your CV into a stunning portfolio website in seconds."
            />
            <TypeRow label="Body MD" usage="Primary UI text" spec="16px · 400 · lh 1.6 · ls 0"
              style={{ fontSize: 'var(--type-body-md-size)', fontWeight: 'var(--type-body-md-weight)', lineHeight: 'var(--type-body-md-lh)', letterSpacing: 'var(--type-body-md-ls)' }}
              sample="Upload your PDF or Word document to get started."
            />
            <TypeRow label="Body SM" usage="Secondary / supporting" spec="14px · 400 · lh 1.6 · ls 0"
              style={{ fontSize: 'var(--type-body-sm-size)', fontWeight: 'var(--type-body-sm-weight)', lineHeight: 'var(--type-body-sm-lh)', letterSpacing: 'var(--type-body-sm-ls)' }}
              sample="Files are processed securely and never stored without consent."
            />

            {/* Caption */}
            <TypeRow label="Caption" usage="Timestamps, tags" spec="12px · 400 · lh 1.5 · ls 0.01em"
              style={{ fontSize: 'var(--type-caption-size)', fontWeight: 'var(--type-caption-weight)', lineHeight: 'var(--type-caption-lh)', letterSpacing: 'var(--type-caption-ls)', color: 'var(--text-muted)' }}
              sample="Last updated 2 minutes ago"
            />
            <TypeRow label="Overline" usage="ALL CAPS fine label" spec="11px · 700 · lh 1.4 · ls 0.1em"
              style={{ fontSize: 'var(--type-overline-size)', fontWeight: 'var(--type-overline-weight)', lineHeight: 'var(--type-overline-lh)', letterSpacing: 'var(--type-overline-ls)', textTransform: 'uppercase', color: 'var(--text-muted)' }}
              sample="Portfolio · Published"
            />

            {/* Button / Label */}
            <TypeRow label="Button LG" usage="Large CTA" spec="16px · 600 · lh 1 · ls 0.01em"
              style={{ fontSize: 'var(--type-btn-lg-size)', fontWeight: 'var(--type-btn-lg-weight)', lineHeight: 'var(--type-btn-lg-lh)', letterSpacing: 'var(--type-btn-lg-ls)' }}
              sample="Generate My Portfolio"
            />
            <TypeRow label="Button MD" usage="Default button" spec="14px · 600 · lh 1 · ls 0.01em"
              style={{ fontSize: 'var(--type-btn-md-size)', fontWeight: 'var(--type-btn-md-weight)', lineHeight: 'var(--type-btn-md-lh)', letterSpacing: 'var(--type-btn-md-ls)' }}
              sample="Publish Site"
            />
            <TypeRow label="Button SM" usage="Compact button" spec="12px · 600 · lh 1 · ls 0.02em"
              style={{ fontSize: 'var(--type-btn-sm-size)', fontWeight: 'var(--type-btn-sm-weight)', lineHeight: 'var(--type-btn-sm-lh)', letterSpacing: 'var(--type-btn-sm-ls)' }}
              sample="Save Changes"
            />
            <TypeRow label="Label" usage="Form labels, hints" spec="12px · 600 · lh 1.4 · ls 0.02em"
              style={{ fontSize: 'var(--type-label-size)', fontWeight: 'var(--type-label-weight)', lineHeight: 'var(--type-label-lh)', letterSpacing: 'var(--type-label-ls)' }}
              sample="Username"
            />

            {/* Code */}
            <TypeRow label="Code" usage="Inline code, mono" spec="14px · 400 · lh 1.6 · ls 0"
              style={{ fontSize: 'var(--type-code-size)', fontWeight: 'var(--type-code-weight)', lineHeight: 'var(--type-code-lh)', letterSpacing: 'var(--type-code-ls)', fontFamily: 'var(--font-mono)' }}
              sample="npm run dev"
            />

          </div>
        </section>

        {/* ── STATUS BADGES ─────────────────────────────────── */}
        <section>
          <SectionLabel>Status Badges</SectionLabel>
          <div className="flex flex-wrap gap-3">
            <StatusBadge variant="success">Success</StatusBadge>
            <StatusBadge variant="error">Error</StatusBadge>
            <StatusBadge variant="warning">Warning</StatusBadge>
            <StatusBadge variant="info">Info</StatusBadge>
          </div>
        </section>

        {/* ── INPUTS ───────────────────────────────────────── */}
        <section>
          <SectionLabel>Text Fields</SectionLabel>

          <div className="space-y-10">

            {/* Sizes */}
            <TokenGroup label="Sizes">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Input size="sm" label="Small" placeholder="Small input" />
                <Input size="md" label="Medium" placeholder="Medium input" />
                <Input size="lg" label="Large" placeholder="Large input" />
              </div>
            </TokenGroup>

            {/* Variants / validation states */}
            <TokenGroup label="Validation States">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Input variant="default" label="Default" placeholder="Enter value" helperText="This is a helper message." />
                <Input variant="error"   label="Error"   placeholder="Enter value" helperText="This field is required." defaultValue="bad input" />
                <Input variant="success" label="Success" placeholder="Enter value" helperText="Username is available." defaultValue="carlyne" />
                <Input variant="warning" label="Warning" placeholder="Enter value" helperText="This email is associated with another account." defaultValue="user@example.com" />
              </div>
            </TokenGroup>

            {/* With prefix / suffix icons */}
            <TokenGroup label="Prefix & Suffix">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Input label="Search" placeholder="Search portfolios…"  prefix={<Search size={16} />} />
                <Input label="Email"  placeholder="you@example.com"     prefix={<Mail size={16} />} />
                <Input label="Username" placeholder="yourname"          prefix={<User size={16} />} suffix={<span style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>.cvtoweb.com</span>} />
                <Input label="Website" placeholder="https://yoursite.com" prefix={<Globe size={16} />} />
              </div>
            </TokenGroup>

            {/* Password */}
            <TokenGroup label="Password">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Input type="password" label="Password" placeholder="Enter password" prefix={<Lock size={16} />} helperText="Minimum 8 characters." />
                <Input type="password" label="Confirm Password" placeholder="Repeat password" prefix={<Lock size={16} />} variant="success" helperText="Passwords match." />
              </div>
            </TokenGroup>

            {/* Clearable + character count */}
            <TokenGroup label="Clearable & Character Count">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Input label="Clearable" defaultValue="Clear me with the ×" clearable />
                <Input label="Character Limit" placeholder="Write a short bio…" maxChars={60} defaultValue="Designer & developer" />
              </div>
            </TokenGroup>

            {/* Special states */}
            <TokenGroup label="Special States">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Input label="Loading"  placeholder="Checking availability…" loading />
                <Input label="Disabled" placeholder="Not editable" disabled helperText="This field is currently disabled." />
                <Input label="Read Only" value="carlyne.cvtoweb.com" readOnly helperText="Your public portfolio URL." />
              </div>
            </TokenGroup>

            {/* Textarea */}
            <TokenGroup label="Textarea">
              <div className="flex flex-col gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Textarea label="Bio" placeholder="Write a short professional summary…" helperText="Shown at the top of your portfolio." />
                <Textarea label="Bio — with limit" placeholder="Write a short professional summary…" maxChars={200} defaultValue="I'm a product designer with 5 years of experience building digital products." helperText="Keep it concise." />
                <Textarea label="Error state" variant="error" defaultValue="!!" helperText="Summary cannot contain special characters." />
                <Textarea label="Disabled" placeholder="Not editable" disabled />
              </div>
            </TokenGroup>

          </div>
        </section>

        {/* ── BUTTONS ──────────────────────────────────────── */}
        <section>
          <SectionLabel>Buttons</SectionLabel>

          {/* Variants */}
          <div className="space-y-10">
            <TokenGroup label="Variants">
              <div className="flex flex-wrap items-center gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </TokenGroup>

            {/* Sizes */}
            <TokenGroup label="Sizes">
              <div className="flex flex-wrap items-center gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Button size="lg">Large</Button>
                <Button size="md">Medium</Button>
                <Button size="sm">Small</Button>
              </div>
            </TokenGroup>

            {/* With icons */}
            <TokenGroup label="With Icons">
              <div className="flex flex-wrap items-center gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Button variant="primary" iconLeft={<Upload size={16} />}>Upload CV</Button>
                <Button variant="primary" iconRight={<ArrowRight size={16} />}>Continue</Button>
                <Button variant="secondary" iconLeft={<Plus size={16} />}>Add Section</Button>
                <Button variant="ghost" iconLeft={<Check size={16} />}>Saved</Button>
                <Button variant="danger" iconLeft={<Trash2 size={16} />}>Delete</Button>
              </div>
            </TokenGroup>

            {/* Loading */}
            <TokenGroup label="Loading State">
              <div className="flex flex-wrap items-center gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Button variant="primary" loading>Uploading…</Button>
                <Button variant="secondary" loading>Saving…</Button>
                <Button variant="danger" loading>Deleting…</Button>
              </div>
            </TokenGroup>

            {/* Disabled */}
            <TokenGroup label="Disabled State">
              <div className="flex flex-wrap items-center gap-4 px-4 py-5 bg-[var(--bg-subtle)]">
                <Button variant="primary" disabled>Primary</Button>
                <Button variant="secondary" disabled>Secondary</Button>
                <Button variant="ghost" disabled>Ghost</Button>
                <Button variant="danger" disabled>Danger</Button>
              </div>
            </TokenGroup>

            {/* Full width */}
            <TokenGroup label="Full Width">
              <div className="px-4 py-5 bg-[var(--bg-subtle)] space-y-3">
                <Button variant="primary" fullWidth iconRight={<ArrowRight size={16} />}>
                  Generate My Portfolio
                </Button>
                <Button variant="secondary" fullWidth>
                  Save Changes
                </Button>
              </div>
            </TokenGroup>
          </div>
        </section>

        {/* ── FILE UPLOAD ───────────────────────────────────── */}
        <FileUploadShowcase />

        {/* ── MODAL ─────────────────────────────────────────── */}
        <ModalShowcase />

        {/* Footer */}
        <footer className="border-t border-[var(--border-subtle)] pt-8 text-[var(--text-muted)] text-xs">
          CVtoWeb Design System · tokens defined in{' '}
          <code className="font-mono bg-[var(--bg-surface)] px-1.5 py-0.5 rounded">
            src/app/globals.css
          </code>
        </footer>

      </div>
    </div>
  );
}

/* ── FileUploadShowcase ──────────────────────────────────── */

function FileUploadShowcase() {
  const [progress, setProgress] = useState<number | null>(null);
  const [simVariant, setSimVariant] = useState<'default' | 'success' | 'error'>('default');

  function simulateUpload() {
    setProgress(0);
    setSimVariant('default');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 6;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(null);
        setSimVariant('success');
      } else {
        setProgress(p);
      }
    }, 300);
  }

  return (
    <section>
      <SectionLabel>File Upload</SectionLabel>
      <div className="space-y-6">

        <TokenGroup label="Sizes">
          <div className="px-4 py-5 bg-[var(--bg-subtle)] space-y-6">
            <FileUpload size="sm" acceptHint="PDF · Max 5MB" accept="application/pdf" />
            <FileUpload size="md" acceptHint="PDF or Word · Max 5MB" accept="application/pdf,.docx" />
            <FileUpload size="lg" acceptHint="PDF or Word · Max 10MB" accept="application/pdf,.docx" />
          </div>
        </TokenGroup>

        <TokenGroup label="Label & Helper Text">
          <div className="px-4 py-5 bg-[var(--bg-subtle)]">
            <FileUpload
              label="Upload your CV"
              helperText="PDF or Word document · Max 5MB"
              acceptHint="PDF or .docx · Max 5MB"
              accept="application/pdf,.docx"
            />
          </div>
        </TokenGroup>

        <TokenGroup label="Validation States">
          <div className="px-4 py-5 bg-[var(--bg-subtle)] space-y-6">
            <FileUpload label="Default" acceptHint="PDF or .docx" variant="default" />
            <FileUpload
              label="Error"
              variant="error"
              helperText="File type not supported. Please upload a PDF or Word document."
              acceptHint="PDF or .docx"
            />
            <FileUpload
              label="Success"
              variant="success"
              helperText="Your CV has been uploaded successfully."
              acceptHint="PDF or .docx"
            />
          </div>
        </TokenGroup>

        <TokenGroup label="Upload Progress (interactive)">
          <div className="px-4 py-5 bg-[var(--bg-subtle)] space-y-4">
            <FileUpload
              label="CV Upload"
              acceptHint="PDF or .docx · Max 5MB"
              accept="application/pdf,.docx"
              variant={simVariant}
              progress={progress}
              helperText={simVariant === 'success' ? 'Upload complete!' : undefined}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={simulateUpload}
              disabled={typeof progress === 'number'}
            >
              Simulate upload
            </Button>
          </div>
        </TokenGroup>

        <TokenGroup label="Multiple Files">
          <div className="px-4 py-5 bg-[var(--bg-subtle)]">
            <FileUpload
              label="Attachments"
              multiple
              acceptHint="Any file type · Max 10MB each"
              maxSize={10 * 1024 * 1024}
              helperText="You can attach multiple documents at once."
            />
          </div>
        </TokenGroup>

        <TokenGroup label="Disabled">
          <div className="px-4 py-5 bg-[var(--bg-subtle)]">
            <FileUpload label="Upload disabled" disabled acceptHint="PDF or .docx · Max 5MB" />
          </div>
        </TokenGroup>

      </div>
    </section>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-xl font-semibold">{children}</h2>
      <div className="flex-1 h-px bg-[var(--border-subtle)]" />
    </div>
  );
}

function ColorSwatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-12 rounded-lg border border-white/5 shadow-sm"
        style={{ background: `var(${cssVar})` }}
      />
      <span className="text-[var(--text-muted)] text-[10px] font-mono text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function SemanticScale({
  label,
  hue,
  swatches,
}: {
  label: string;
  hue: string;
  swatches: { name: string; token: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-[var(--text-muted)] text-[10px] font-mono mb-3">{hue}</p>
      <div className="flex flex-col gap-1.5">
        {swatches.map(({ name, token }) => (
          <div key={name} className="flex items-center gap-2">
            <div
              className="w-8 h-6 rounded border border-white/5 flex-shrink-0"
              style={{ background: `var(${token})` }}
            />
            <span className="text-[var(--text-muted)] text-[10px] font-mono">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ModalShowcase ───────────────────────────────────────── */

function ModalShowcase() {
  const [openModal, setOpenModal] = useState<'basic' | 'form' | 'confirm' | null>(null);

  return (
    <section>
      <SectionLabel>Modal</SectionLabel>

      <div className="space-y-6">
        <TokenGroup label="Sizes & Variants">
          <div className="px-4 py-5 bg-[var(--bg-subtle)] flex flex-wrap gap-3">

            {/* Basic / informational */}
            <Button variant="secondary" size="md" onClick={() => setOpenModal('basic')}>
              Basic Modal
            </Button>

            {/* With form inputs */}
            <Button variant="secondary" size="md" onClick={() => setOpenModal('form')}>
              Form Modal
            </Button>

            {/* Confirmation / destructive */}
            <Button variant="secondary" size="md" onClick={() => setOpenModal('confirm')}>
              Confirm Modal
            </Button>
          </div>
        </TokenGroup>
      </div>

      {/* ── Basic modal ─────────────────────────────────── */}
      <Modal
        isOpen={openModal === 'basic'}
        onClose={() => setOpenModal(null)}
        title="Portfolio Published"
        description="Your portfolio is now live and shareable with the world."
        footer={
          <Button variant="primary" size="md" onClick={() => setOpenModal(null)}>
            Got it
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            padding: '1rem', borderRadius: '0.75rem',
            backgroundColor: 'oklch(0.52 0.17 145 / 0.1)',
            border: '1px solid oklch(0.52 0.17 145 / 0.3)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <span style={{ color: 'var(--success-400)', fontSize: '1.25rem' }}>✓</span>
            <div>
              <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-primary)', fontWeight: 600 }}>
                yourname.cvtoweb.com
              </p>
              <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
                Live · Updates instantly
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Form modal ──────────────────────────────────── */}
      <Modal
        isOpen={openModal === 'form'}
        onClose={() => setOpenModal(null)}
        title="Publish Your Portfolio"
        description="Choose your unique URL and we'll make it live."
        size="md"
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpenModal(null)}>Cancel</Button>
            <Button variant="primary" size="md">Publish</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Your URL"
            size="md"
            placeholder="yourname"
            suffix={<span style={{ fontSize: 'var(--type-body-sm-size)', whiteSpace: 'nowrap' }}>.cvtoweb.com</span>}
          />
          <Input
            label="Email Address"
            size="md"
            type="email"
            placeholder="you@example.com"
            helperText="We'll send you a link to edit your portfolio later"
          />
        </div>
      </Modal>

      {/* ── Confirm modal ───────────────────────────────── */}
      <Modal
        isOpen={openModal === 'confirm'}
        onClose={() => setOpenModal(null)}
        title="Delete Portfolio"
        description="This action cannot be undone. Your portfolio and its URL will be permanently removed."
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setOpenModal(null)}>Cancel</Button>
            <Button variant="danger" size="md">Delete</Button>
          </>
        }
      />
    </section>
  );
}

function TokenGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
        {label}
      </p>
      <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden divide-y divide-[var(--border-subtle)]">
        {children}
      </div>
    </div>
  );
}

function TokenRow({
  token,
  label,
  description,
}: {
  token: string;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] transition-colors">
      <div
        className="w-8 h-8 rounded-md border border-white/10 flex-shrink-0"
        style={{ background: `var(${token})` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none mb-1">{label}</p>
        <p className="text-[var(--text-muted)] text-xs">{description}</p>
      </div>
      <code className="text-[var(--text-muted)] text-[10px] font-mono hidden md:block flex-shrink-0">
        {token}
      </code>
    </div>
  );
}

function TypeRow({
  label,
  usage,
  spec,
  style,
  sample,
}: {
  label: string;
  usage: string;
  spec: string;
  style: React.CSSProperties;
  sample: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 py-5 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex flex-col justify-center gap-1 flex-shrink-0">
        <p className="text-xs font-semibold text-[var(--text-primary)]">{label}</p>
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{usage}</p>
        <p className="text-[10px] font-mono text-[var(--text-disabled)] mt-1 leading-relaxed">{spec}</p>
      </div>
      <div className="flex items-center overflow-hidden">
        <span style={style} className="truncate">{sample}</span>
      </div>
    </div>
  );
}

function StatusBadge({
  variant,
  children,
}: {
  variant: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}) {
  const styles = {
    success: { background: 'var(--success-900)', color: 'var(--success-400)', border: 'var(--success-600)' },
    error:   { background: 'var(--error-900)',   color: 'var(--error-400)',   border: 'var(--error-600)' },
    warning: { background: 'var(--warning-900)', color: 'var(--warning-400)', border: 'var(--warning-600)' },
    info:    { background: 'var(--info-900)',     color: 'var(--info-400)',    border: 'var(--info-600)' },
  }[variant];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: styles.background,
        color: styles.color,
        borderColor: styles.border,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: styles.color }} />
      {children}
    </span>
  );
}
