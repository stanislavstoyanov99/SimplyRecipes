namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.InputModels.Administration.Recipes;
    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;

    public class RecipesController : ApiController
    {
        private const int PageSize = 12;

        private readonly IRecipesService recipesService;
        private readonly ICategoriesService categoriesService;
        private readonly UserManager<SimplyRecipesUser> userManager;

        public RecipesController(
            IRecipesService recipesService,
            ICategoriesService categoriesService,
            UserManager<SimplyRecipesUser> userManager)
        {
            this.recipesService = recipesService;
            this.categoriesService = categoriesService;
            this.userManager = userManager;
        }

        [HttpGet]
        [Route("by-category")]
        public async Task<IActionResult> ByCategory(string categoryName)
        {
            var recipes = this.recipesService
                .GetAllRecipesByFilterAsQueryeable<RecipeListingViewModel>(categoryName);

            var recipesPaginated = await PaginatedList<RecipeListingViewModel>
                .CreateAsync(recipes, 1, PageSize);

            return this.Ok(recipesPaginated);
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult> Details(int id)
        {
            var recipe = await this.recipesService.GetViewModelByIdAsync<RecipeDetailsViewModel>(id);

            return this.Ok(recipe);
        }

        [HttpGet("list")]
        public async Task<ActionResult> List()
        {
            var user = await this.userManager.GetUserAsync(this.User);

            var recipes = await this.recipesService.GetAllRecipesByUserId<RecipeDetailsViewModel>(user.Id);
            var categories = await this.categoriesService.GetAllCategoriesAsync<CategoryDetailsViewModel>();

            var responseModel = new RecipeListViewModel
            {
                Recipes = recipes,
                Categories = categories,
            };

            return this.Ok(responseModel);
        }

        [HttpGet("submit")]
        public async Task<ActionResult> Submit()
        {
            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryDetailsViewModel>();

            return this.Ok(categories);
        }

        [Authorize]
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] RecipeCreateInputModel recipeCreateInputModel)
        {
            var user = await this.userManager.GetUserAsync(this.User);

            var recipe = await this.recipesService.CreateAsync(recipeCreateInputModel, user.Id);
            return this.Ok(recipe);
        }

        [Authorize]
        [HttpPost("remove")]
        public async Task<IActionResult> Remove([FromBody] int id)
        {
            await this.recipesService.DeleteByIdAsync(id);

            return this.Ok();
            //return this.RedirectToAction("RecipeList", "Recipes");
        }

        [Authorize]
        [HttpPost("edit")]
        public async Task<IActionResult> Edit([FromBody] MyRecipeDetailsViewModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(model.RecipeEditViewModel);
            }

            await this.recipesService.EditAsync(model.RecipeEditViewModel);
            return this.Ok();
            //return this.RedirectToAction("RecipeList", "Recipes");
        }

        [HttpGet("recipe/{id}")]
        public async Task<RecipeDetailsViewModel> GetRecipe(int id)
        {
            var responseModel = await this.recipesService.GetViewModelByIdAsync<RecipeDetailsViewModel>(id);

            return responseModel;
        }
    }
}
