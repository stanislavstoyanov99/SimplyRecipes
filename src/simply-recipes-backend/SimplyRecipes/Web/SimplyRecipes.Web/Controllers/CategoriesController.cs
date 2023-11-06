namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.Categories;
    using SimplyRecipes.Models.InputModels.Administration.Categories;
    using SimplyRecipes.Common;

    public class CategoriesController : ApiController
    {
        private readonly ICategoriesService categoriesService;

        public CategoriesController(ICategoriesService categoriesService)
        {
            this.categoriesService = categoriesService;
        }

        [HttpGet("all")]
        [ProducesResponseType(
            typeof(IEnumerable<CategoryDetailsViewModel>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult> All()
        {
            var categories = await this.categoriesService
                .GetAllAsync<CategoryDetailsViewModel>();

            return this.Ok(categories);
        }

        [HttpPost("submit")]
        [ProducesResponseType(typeof(CategoryDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Submit([FromForm] CategoryCreateInputModel categoryCreateInputModel)
        {
            try
            {
                var category = await this.categoriesService
                    .CreateAsync(categoryCreateInputModel);

                return this.Ok(category);
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

        [HttpPut("edit")]
        [ProducesResponseType(typeof(CategoryDetailsViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Edit([FromForm] CategoryEditViewModel categoryEditViewModel)
        {
            try
            {
                var category = await this.categoriesService
                    .EditAsync(categoryEditViewModel);

                return this.Ok(category);
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
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<ActionResult> Remove(int id)
        {
            try
            {
                await this.categoriesService.DeleteByIdAsync(id);

                return this.Ok();
            }
            catch (NullReferenceException nre)
            {
                return this.BadRequest(nre.Message);
            }
        }
    }
}
