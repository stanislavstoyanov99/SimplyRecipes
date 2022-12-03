namespace SimplyRecipes.Models.ViewModels.Articles
{
    using System.Collections.Generic;

    using SimplyRecipes.Models.ViewModels.ArticleComments;
    using SimplyRecipes.Models.ViewModels.Categories;

    public class DetailsListingViewModel
    {
        public CreateArticleCommentInputModel CreateArticleCommentInputModel { get; set; }

        public ArticleListingViewModel ArticleListingViewModel { get; set; }

        public IEnumerable<CategoryListingViewModel> Categories { get; set; }

        public IEnumerable<RecentArticleListingViewModel> RecentArticles { get; set; }
    }
}
