namespace SimplyRecipes.Models.ViewModels.AdminDashboard
{
    using System.Collections.Generic;

    public class StatisticsViewModel
    {
        public int RecipesCount { get; set; }

        public int ArticlesCount { get; set; }

        public int ReviewsCount { get; set; }

        public int RegisteredUsersCount { get; set; }

        public int AdminsCount { get; set; }

        public int ArticleCommentsCount { get; set; }

        public IEnumerable<TopCategoryViewModel> TopCategories { get; set; }

        public IEnumerable<TopRecipeViewModel> TopRecipes { get; set; }

        public IEnumerable<TopArticleViewModel> TopArticleComments { get; set; }

        public Dictionary<string, int> RegisteredUsersPerMonth { get; set; }

        public Dictionary<string, int> RegisteredAdminsPerMonth { get; set; }
    }
}
