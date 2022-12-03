namespace SimplyRecipes.Models.ViewModels.Home
{
    using System.Collections.Generic;

    using SimplyRecipes.Models.ViewModels.Articles;
    using SimplyRecipes.Models.ViewModels.Recipes;

    public class HomePageViewModel
    {
        public IEnumerable<ArticleListingViewModel> RecentArticles { get; set; }

        public IEnumerable<RecipeListingViewModel> TopRecipes { get; set; }

        public IEnumerable<GalleryViewModel> Gallery { get; set; }
    }
}
