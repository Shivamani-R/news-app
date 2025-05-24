import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Article } from "@/lib/types"

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  // Create a simple hash of the article title to use as an ID
  const id = Buffer.from(article.title).toString("base64").replace(/[+/=]/g, "")

  return (
    <Link href={`/article/${id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
        <div className="relative w-full h-48">
          <Image
            src={article.urlToImage || "/placeholder.svg?height=192&width=384"}
            alt={article.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1">
            {article.source.name}
          </div>
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold line-clamp-2 mb-2">{article.title}</h2>
          <p className="text-gray-600 line-clamp-3 text-sm">{article.description}</p>
        </CardContent>
        <CardFooter className="px-4 py-3 text-xs text-gray-500 border-t">{formatDate(article.publishedAt)}</CardFooter>
      </Card>
    </Link>
  )
}
