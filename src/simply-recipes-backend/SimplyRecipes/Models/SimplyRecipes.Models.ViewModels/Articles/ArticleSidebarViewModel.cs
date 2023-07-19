namespace SimplyRecipes.Models.ViewModels.Articles
{
    using System.Collections.Generic;

    using SimplyRecipes.Models.ViewModels.Categories;

    public class ArticleSidebarViewModel
    {
        public IEnumerable<CategoryListingViewModel> Categories { get; set; }

        public IEnumerable<RecentArticleListingViewModel> RecentArticles { get; set; }
    }
}
