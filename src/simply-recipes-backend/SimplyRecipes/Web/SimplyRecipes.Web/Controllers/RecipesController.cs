namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Common;
    using SimplyRecipes.Models.Common;
    using SimplyRecipes.Models.InputModels.Administration.Recipes;
    using SimplyRecipes.Models.ViewModels;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Models.ViewModels.Recipes;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Web.Infrastructure.Services;

    public class RecipesController : ApiController
    {
        private const int PageSize = 10;

        private readonly IRecipesService recipesService;
        private readonly ICategoriesService categoriesService;
        private readonly ICurrentUserService currentUserService;

        public RecipesController(
            IRecipesService recipesService,
            ICategoriesService categoriesService,
            ICurrentUserService currentUserService)
        {
            this.recipesService = recipesService;
            this.categoriesService = categoriesService;
            this.currentUserService = currentUserService;
        }

        [HttpGet("details/{id}")]
        [ProducesResponseType(typeof(RecipeDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> Details(int id)
        {
            try
            {
                var recipe = await this.recipesService
                    .GetViewModelByIdAsync<RecipeDetailsViewModel>(id);

                return this.Ok(recipe);
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }

        [HttpGet("get-all")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<RecipeDetailsViewModel>),
            StatusCodes.Status200OK)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> All([FromQuery] int? pageNumber)
        {
            var recipes = this.recipesService
                .GetAllRecipesAsQueryeable<RecipeDetailsViewModel>();
            var recipesPaginated = await PaginatedList<RecipeDetailsViewModel>
                .CreateAsync(recipes, pageNumber ?? 1, PageSize);

            var responseModel = new PaginatedViewModel<RecipeDetailsViewModel>
            {
                Items = recipesPaginated,
                PageNumber = pageNumber ?? 1,
                PageSize = PageSize,
                Count = await recipes.CountAsync()
            };

            return this.Ok(responseModel);
        }

        [HttpGet("all")]
        [ProducesResponseType(
            typeof(PaginatedViewModel<RecipeListingViewModel>),
            StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult> AllPaginated([FromQuery] string categoryName, [FromQuery] int? pageNumber)
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
        [ProducesResponseType(
            typeof(IEnumerable<RecipeDetailsViewModel>),
            StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult> UserRecipes()
        {
            var userId = this.currentUserService.GetId();
            var recipes = await this.recipesService
                .GetAllRecipesByUserId<RecipeDetailsViewModel>(userId);

            return this.Ok(recipes);
        }

        [HttpGet("submit")]
        [ProducesResponseType(
            typeof(IEnumerable<CategoryDetailsViewModel>),
            StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult> Submit()
        {
            var categories = await this.categoriesService
                .GetAllCategoriesAsync<CategoryDetailsViewModel>();

            return this.Ok(categories);
        }

        [HttpPost("submit")]
        [ProducesResponseType(typeof(RecipeDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> Submit([FromForm] RecipeCreateInputModel recipeCreateInputModel)
        {
            try
            {
                var userId = this.currentUserService.GetId();
                var recipe = await this.recipesService
                    .CreateAsync(recipeCreateInputModel, userId);

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

        [HttpDelete("remove/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
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

        [HttpPut("edit")]
        [ProducesResponseType(typeof(RecipeDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> Edit([FromForm] RecipeEditViewModel model)
        {
            try
            {
                var recipe = await this.recipesService
                    .EditAsync(model);

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
