export {
  useAuth,
  useCurrentUser,
  useUserProfile,
  useUpdateUser,
  type User,
} from './useAuth'

export {
  useResearchList,
  useResearchById,
  useResearchCategories,
  useCreateResearchProject,
  type ResearchProject,
  type ResearchCategory,
  type ResearchParticipant,
  type ResearchUpdate,
  type ResearchAttachment,
} from './useResearch'

export {
  useForumTopics,
  useForumTopicById,
  useForumCategories,
  useCreateForumTopic,
  type ForumThread,
  type ForumCategory,
  type ForumReply,
} from './useForum'

export {
  useActionsList,
  useActionById,
  useActionParticipants,
  useCreateAction,
  useRegisterForAction,
  type ClimateAction,
  type ActionParticipant,
} from './useActions'

export {
  usePolicies,
  usePolicyById,
  usePolicyEndorsements,
  type PolicyUpdate,
  type PolicyEndorsement,
  type PolicyReport,
} from './usePolicy'

export { useDatasets, useDatasetById, type Dataset } from './useOpenData'

export {
  usePartners,
  usePartnershipInquiries,
  type Partner,
  type PartnershipInquiry,
} from './usePartners'

export { useNotifications, useMarkNotificationRead, type Notification } from './useNotifications'
export { useBookmarks, type Bookmark } from './useBookmarks'
