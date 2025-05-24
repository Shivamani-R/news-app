import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { fetchArticleById } from "@/lib/news"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await fetchArticleById(params.id)

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to news
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center text-gray-500 mb-6">
          <div>
            {article.source.name} • {formatDate(article.publishedAt)}
          </div>
        </div>

        {article.urlToImage && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image src={article.urlToImage || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-xl font-medium mb-6">{article.description}</p>
          <p className="whitespace-pre-line">{article.content}</p>

          <div className="mt-8 pt-6 border-t">
            <p className="mb-4">
              <span className="font-semibold">Author:</span> {article.author || "Unknown"}
            </p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Read the full article on {article.source.name}
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
