namespace SimplyRecipes.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using System.Threading.Tasks;

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
        public async Task<ActionResult> All()
        {
            var categories = await this.categoriesService.GetAllCategoriesAsync<CategoryDetailsViewModel>();

            return this.Ok(categories);
        }

        [HttpPost("submit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<IActionResult> Submit([FromForm] CategoryCreateInputModel categoryCreateInputModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(categoryCreateInputModel);
            }

            var category = await this.categoriesService.CreateAsync(categoryCreateInputModel);

            return this.Ok(category);
        }

        [HttpPut("edit")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<IActionResult> Edit([FromForm] CategoryEditViewModel categoryEditViewModel)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(categoryEditViewModel);
            }

            var category = await this.categoriesService.EditAsync(categoryEditViewModel);

            return this.Ok(category);
        }

        [HttpDelete("remove/{id}")]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public async Task<IActionResult> Remove(int id)
        {
            await this.categoriesService.DeleteByIdAsync(id);

            return this.Ok();
        }
    }
}
