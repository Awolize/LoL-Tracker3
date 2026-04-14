export const seo = ({
    title,
    description,
    keywords,
    image,
}: {
    title: string
    description?: string
    image?: string
    keywords?: string
}) => {
    const tags = [
        { title },
        { name: 'description', content: description },
        { name: 'keywords', content: keywords ?? 'league of legends, tracker, summoner, challenge, player, stats, matches, mastery, champions' },
        { name: 'theme-color', content: '#4FB8B2' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:site_name', content: "Awot's Challenge Tracker" },
        ...(image
            ? [
                { property: 'og:image', content: image },
                { property: 'og:image:alt', content: title },
                { name: 'twitter:card', content: 'summary_large_image' },
            ]
            : []),
    ]
    return tags
}