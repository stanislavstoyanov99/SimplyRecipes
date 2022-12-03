namespace SimplyRecipes.Models.ViewModels.Categories
{
    using System.Collections.Generic;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Services.Mapping;

    public class CategoryListingViewModel : IMapFrom<Category>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<RecentArticleListingViewModel> Articles { get; set; }
    }
}
