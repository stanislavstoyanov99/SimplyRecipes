namespace SimplyRecipes.Models.Common
{
    using SimplyRecipes.Models.ViewModels;

    public class PaginatedViewModel<T>
    {
        public PaginatedList<T> Items { get; set; }

        public int Count { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }
}
