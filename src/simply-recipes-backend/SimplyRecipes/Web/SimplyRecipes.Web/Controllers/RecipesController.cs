namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Models.Common;
    using SimplyRecipes.Models.InputModels.Administration.Recipes;
    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Services.Data.Interfaces;

    public class RecipesController : ApiController
    {
        private const int PageSize = 10;

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

        [HttpGet("details/{id}")]
        public async Task<ActionResult> Details(int id)
        {
            try
            {
                var recipe = await this.recipesService.GetViewModelByIdAsync<RecipeDetailsViewModel>(id);

                return this.Ok(recipe);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpGet("all")]
        public async Task<ActionResult> All()
        {
            var recipes = await this.recipesService.GetAllRecipesAsync<RecipeDetailsViewModel>();

            return this.Ok(recipes);
        }

        [HttpGet("all/{categoryName}/{pageNumber?}")]
        public async Task<ActionResult> AllPaginated(string categoryName, int? pageNumber)
        {
            var recipes = this.recipesService
                .GetAllRecipesByFilterAsQueryeable<RecipeListingViewModel>(categoryName);

            var recipesPaginated = await PaginatedList<RecipeListingViewModel>
                .CreateAsync(recipes, pageNumber ?? 1, PageSize);

            var responseModel = new PaginatedViewModel<RecipeListingViewModel>
            {
                Items = recipesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = PageSize,
                Count = await recipes.CountAsync()
            };

            return this.Ok(responseModel);
        }

        [HttpGet("user-recipes")]
        public async Task<ActionResult> UserRecipes()
        {
            var user = await this.userManager.GetUserAsync(this.User);
            var recipes = await this.recipesService.GetAllRecipesByUserId<RecipeDetailsViewModel>(user.Id);

            return this.Ok(recipes);
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
        public async Task<ActionResult> Submit([FromForm] RecipeCreateInputModel recipeCreateInputModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(recipeCreateInputModel);
            }

            try
            {
                var user = await this.userManager.GetUserAsync(this.User);

                var recipe = await this.recipesService.CreateAsync(recipeCreateInputModel, user.Id);
                return this.Ok(recipe);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [Authorize]
        [HttpDelete("remove/{id}")]
        public async Task<ActionResult> Remove(int id)
        {
            try
            {
                await this.recipesService.DeleteByIdAsync(id);

                return this.Ok();
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [Authorize]
        [HttpPut("edit")]
        public async Task<ActionResult> Edit([FromForm] RecipeEditViewModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(model);
            }

            try
            {
                var recipe = await this.recipesService.EditAsync(model);
                return this.Ok(recipe);
            }
            catch (ArgumentException aex)
            {
                return this.BadRequest(aex.Message);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
