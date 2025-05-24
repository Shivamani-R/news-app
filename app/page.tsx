import { NewsCard } from "@/components/news-card"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { Pagination } from "@/components/pagination"
import { fetchNews } from "@/lib/news"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : "general"
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1

  const { articles, totalResults } = await fetchNews({ search, category, page })
  const totalPages = Math.ceil(totalResults / 12)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Global News Hub</h1>

      <div className="mb-8">
        <SearchBar initialSearch={search} />
      </div>

      <div className="mb-8">
        <CategoryFilter activeCategory={category} />
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">No articles found</h2>
          <p className="mt-2 text-gray-500">Try adjusting your search or category filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>

          <div className="mt-12">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </main>
  )
}
