namespace SimplyRecipes.Models.ViewModels
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.EntityFrameworkCore;

    public class PaginatedList<T> : List<T>
    {
        public PaginatedList(List<T> items, int? pageIndex)
        {
            this.PageIndex = pageIndex;

            this.AddRange(items);
        }

        public int? PageIndex { get; private set; }

        public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int? pageIndex, int pageSize)
        {
            var items = await source.Skip((pageIndex - 1 ?? 0) * pageSize).Take(pageSize).ToListAsync();

            return new PaginatedList<T>(items, pageIndex);
        }
    }
}
