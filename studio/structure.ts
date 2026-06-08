import type {
  DocumentActionComponent,
  DocumentActionsResolver,
  NewDocumentOptionsResolver,
} from 'sanity'
import type {StructureResolver} from 'sanity/structure'

const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'visitPage',
  'contactPage',
  'jobsPage',
  'bookEventPage',
  'beerAttributeLibrary',
])

const singletonDocuments = [
  {id: 'siteSettings', title: 'Site Settings', schemaType: 'siteSettings'},
  {id: 'homePage', title: 'Home Page', schemaType: 'homePage'},
  {id: 'aboutPage', title: 'About Page', schemaType: 'aboutPage'},
  {id: 'visitPage', title: 'Visit Page', schemaType: 'visitPage'},
  {id: 'contactPage', title: 'Contact Page', schemaType: 'contactPage'},
  {id: 'jobsPage', title: 'Jobs Page', schemaType: 'jobsPage'},
  {id: 'bookEventPage', title: 'Book an Event Page', schemaType: 'bookEventPage'},
  {id: 'beerAttributeLibrary', title: 'Beer Attribute Library', schemaType: 'beerAttributeLibrary'},
] as const

const collectionDocuments = [
  {title: 'Beers', schemaType: 'beer'},
  {title: 'Events', schemaType: 'event'},
  {title: 'Locations', schemaType: 'eventLocation'},
  {title: 'Announcements', schemaType: 'announcement'},
  {title: 'Team Members', schemaType: 'teamMember'},
  {title: 'Job Openings', schemaType: 'jobOpening'},
] as const

const singletonDocumentNode = (S: Parameters<StructureResolver>[0], schemaType: string, id: string) =>
  S.document().schemaType(schemaType).documentId(id)

export const documentActions: DocumentActionsResolver = (
  prev: DocumentActionComponent[],
  context: Parameters<DocumentActionsResolver>[1],
) => {
  if (!singletonTypes.has(context.schemaType)) {
    return prev
  }

  return prev.filter((action) => action.action !== 'delete' && action.action !== 'duplicate')
}

export const newDocumentOptions: NewDocumentOptionsResolver = (
  prev: Parameters<NewDocumentOptionsResolver>[0],
  context: Parameters<NewDocumentOptionsResolver>[1],
) => {
  if (
    context.creationContext.type === 'structure' &&
    context.creationContext.schemaType &&
    singletonTypes.has(context.creationContext.schemaType)
  ) {
    return []
  }

  return prev.filter((item) => {
    if (item.templateId && singletonTypes.has(item.templateId)) {
      return false
    }

    return true
  })
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Singletons')
        .child(
          S.list()
            .title('Singletons')
            .items(
              singletonDocuments.map((document) =>
                S.listItem()
                  .title(document.title)
                  .child(singletonDocumentNode(S, document.schemaType, document.id)),
              ),
            ),
        ),
      S.divider(),
      S.listItem()
        .title('Collections')
        .child(
          S.list()
            .title('Collections')
            .items(
              collectionDocuments.map((document) =>
                S.listItem()
                  .title(document.title)
                  .child(S.documentTypeList(document.schemaType).title(document.title)),
              ),
            ),
        ),
    ])
