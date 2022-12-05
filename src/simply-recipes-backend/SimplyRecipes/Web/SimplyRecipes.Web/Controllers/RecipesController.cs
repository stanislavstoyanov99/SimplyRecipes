namespace SimplyRecipes.Web.Controllers
{
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.InputModels.Administration.Recipes;
    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Models.ViewModels.Reviews;
    using SimplyRecipes.Services.Data.Interfaces;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;

    public class RecipesController : ApiController
    {
        private const int PageSize = 12;

        private readonly IRecipesService recipesService;
        private readonly IReviewsService reviewsService;
        private readonly ICategoriesService categoriesService;
        private readonly UserManager<SimplyRecipesUser> userManager;

        public RecipesController(
            IRecipesService recipesService,
            ICategoriesService categoriesService,
            IReviewsService reviewsService,
            UserManager<SimplyRecipesUser> userManager)
        {
            this.recipesService = recipesService;
            this.categoriesService = categoriesService;
            this.userManager = userManager;
            this.reviewsService = reviewsService;
        }

        [HttpGet]
        [Route("{categoryName}/{pageNumber?}")]
        public async Task<IActionResult> Get(string categoryName, int? pageNumber)
        {
            var recipes = this.recipesService
                .GetAllRecipesByFilterAsQueryeable<RecipeListingViewModel>(categoryName);

            var recipesPaginated = await PaginatedList<RecipeListingViewModel>
                .CreateAsync(recipes, pageNumber ?? 1, PageSize);

            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryListingViewModel>();

            var reviews = await this.reviewsService
                .GetTopReviews<ReviewListingViewModel>();

            var responseModel = new RecipeIndexPageViewModel
            {
                RecipesPaginated = recipesPaginated,
                Categories = categories,
                Reviews = reviews,
            };

            return this.Ok(responseModel);
        }

        [HttpGet("Details/{id}")]
        public async Task<ActionResult> Details(int id)
        {
            var recipe = await this.recipesService.GetViewModelByIdAsync<RecipeDetailsViewModel>(id);

            var responseModel = new RecipeDetailsPageViewModel
            {
                Recipe = recipe,
                CreateReviewInputModel = new CreateReviewInputModel(),
            };

            return this.Ok(responseModel);
        }

        [HttpGet("List")]
        public async Task<ActionResult> List()
        {
            var user = await this.userManager.GetUserAsync(this.User);

            var recipes = await this.recipesService.GetAllRecipesByUserId<RecipeDetailsViewModel>(user.Id);
            var categories = await this.categoriesService.GetAllCategoriesAsync<CategoryDetailsViewModel>();

            var responseModel = new MyRecipeDetailsViewModel
            {
                Recipes = recipes,
                RecipeEditViewModel = new RecipeEditViewModel { Categories = categories, },
            };

            return this.Ok(responseModel);
        }

        [HttpGet("Submit")]
        public async Task<ActionResult> Submit()
        {
            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryDetailsViewModel>();

            var responseModel = new RecipeCreateInputModel
            {
                Categories = categories,
            };

            return this.Ok(responseModel);
        }

        [Authorize]
        [HttpPost("Submit")]
        public async Task<IActionResult> Submit([FromBody] RecipeCreateInputModel recipeCreateInputModel)
        {
            var user = await this.userManager.GetUserAsync(this.User);

            if (!this.ModelState.IsValid)
            {
                var categories = await this.categoriesService
                  .GetAllCategoriesAsync<CategoryDetailsViewModel>();

                recipeCreateInputModel.Categories = categories;

                return this.Ok(recipeCreateInputModel);
            }

            var recipe = await this.recipesService.CreateAsync(recipeCreateInputModel, user.Id);
            return this.Ok();
            //return this.RedirectToAction("Details", "Recipes", new { id = recipe.Id });
        }

        [Authorize]
        [HttpPost("Remove")]
        public async Task<IActionResult> Remove([FromBody] int id)
        {
            await this.recipesService.DeleteByIdAsync(id);

            return this.Ok();
            //return this.RedirectToAction("RecipeList", "Recipes");
        }

        [Authorize]
        [HttpPost("Edit")]
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

        [HttpGet("Recipe/{id}")]
        public async Task<RecipeDetailsViewModel> GetRecipe(int id)
        {
            var responseModel = await this.recipesService.GetViewModelByIdAsync<RecipeDetailsViewModel>(id);

            return responseModel;
        }
    }
}
