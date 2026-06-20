import { createFileRoute, Link } from '@tanstack/react-router'
import { useResearchList } from '@/hooks/useResearch'
import { useForumTopics } from '@/hooks/useForum'
import { useActionsList } from '@/hooks/useActions'
import { usePolicies } from '@/hooks/usePolicy'
import { useAuth } from '@/hooks/useAuth'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const research = useResearchList()
  const forum = useForumTopics()
  const actions = useActionsList()
  const policy = usePolicies()
  const { data: session } = useAuth()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">{COPY.common.appName}</h1>
      <p className="mt-2 text-muted-foreground">
        An open-source platform for ecological research, climate action, and
        legislative advocacy.
      </p>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {COPY.research.title}
          </h2>
          <Link
            to={session ? '/research/propose' : '/auth/login'}
            search={session ? undefined : { returnUrl: '/' }}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {COPY.research.proposeTitle}
          </Link>
        </div>
        {research.isLoading && <p className="text-sm text-muted-foreground">{COPY.common.loading}</p>}
        {research.error && <p className="text-sm text-destructive">{COPY.common.error}</p>}
        <ul className="mt-2 space-y-2">
          {research.data?.slice(0, 3).map((item) => (
            <li key={item.id}>
              <Link
                to="/research/$id"
                params={{ id: item.id }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {COPY.forum.title}
          </h2>
          <Link
            to={session ? '/forum/new' : '/auth/login'}
            search={session ? undefined : { returnUrl: '/' }}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {COPY.forum.newTopic}
          </Link>
        </div>
        {forum.isLoading && <p className="text-sm text-muted-foreground">{COPY.common.loading}</p>}
        {forum.error && <p className="text-sm text-destructive">{COPY.common.error}</p>}
        <ul className="mt-2 space-y-2">
          {forum.data?.slice(0, 3).map((item) => (
            <li key={item.id}>
              <Link
                to="/forum/$id"
                params={{ id: item.id }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {COPY.actions.title}
          </h2>
          <Link
            to={session ? '/actions/register' : '/auth/login'}
            search={session ? undefined : { returnUrl: '/' }}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            {COPY.actions.proposeAction}
          </Link>
        </div>
        {actions.isLoading && <p className="text-sm text-muted-foreground">{COPY.common.loading}</p>}
        {actions.error && <p className="text-sm text-destructive">{COPY.common.error}</p>}
        <ul className="mt-2 space-y-2">
          {actions.data?.slice(0, 3).map((item) => (
            <li key={item.id}>
              <Link
                to="/actions/$id"
                params={{ id: item.id }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">
          {COPY.policy.title}
        </h2>
        {policy.isLoading && <p className="text-sm text-muted-foreground">{COPY.common.loading}</p>}
        {policy.error && <p className="text-sm text-destructive">{COPY.common.error}</p>}
        <ul className="mt-2 space-y-2">
          {policy.data?.slice(0, 3).map((item) => (
            <li key={item.id}>
              <Link
                to="/policy/$id"
                params={{ id: item.id }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
