import { createFileRoute } from '@tanstack/react-router'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/contact/')({
  component: Contact,
})

function Contact() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Contact</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-foreground">
        <p>
          Have questions, feedback, or partnership inquiries? We&apos;d love to hear from
          you. Reach out to the {COPY.common.appName} team using the information below.
        </p>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="font-medium text-foreground">Email</p>
          <p className="mt-1 text-muted-foreground">hello@climatecommons.org</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="font-medium text-foreground">Address</p>
          <p className="mt-1 text-muted-foreground">
            Climate Commons HQ
            <br />
            123 Sustainability Way
            <br />
            Earth City, EC 10101
          </p>
        </div>
      </div>
    </main>
  )
}
