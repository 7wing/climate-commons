import { createFileRoute } from '@tanstack/react-router'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/forum-guidelines/')({
  component: ForumGuidelines,
})

function ForumGuidelines() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Forum Guidelines</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-foreground">
        <p>
          Welcome to the {COPY.common.appName} forum. These guidelines help keep our
          community respectful, constructive, and focused on climate action and
          ecological research.
        </p>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Be respectful and constructive in all discussions.</li>
          <li>Stay on topic and avoid spam or off-topic posts.</li>
          <li>Do not share misinformation or unsubstantiated claims.</li>
          <li>Respect privacy and do not share personal data without consent.</li>
          <li>Report any violations to the moderation team.</li>
        </ul>
      </div>
    </main>
  )
}
