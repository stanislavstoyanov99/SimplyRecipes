﻿namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using SimplyRecipes.Models.InputModels.Administration.Categories;
    using SimplyRecipes.Models.ViewModels.Categories;

    public interface ICategoriesService : IBaseDataService
    {
        Task<CategoryDetailsViewModel> CreateAsync(CategoryCreateInputModel categoryCreateInputModel);

        Task EditAsync(CategoryEditViewModel categoryEditViewModel);

        Task<IEnumerable<TEntity>> GetAllCategoriesAsync<TEntity>();

        Task<TViewModel> GetCategoryAsync<TViewModel>(string name);
    }
}
