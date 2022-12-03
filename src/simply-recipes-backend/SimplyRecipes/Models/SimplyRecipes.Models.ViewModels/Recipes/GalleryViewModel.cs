namespace SimplyRecipes.Models.ViewModels.Recipes
{
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Mapping;

    public class GalleryViewModel : IMapFrom<Recipe>
    {
        public int Id { get; set; }

        public string ImagePath { get; set; }
    }
}
