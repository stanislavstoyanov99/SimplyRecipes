namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;

    using Microsoft.EntityFrameworkCore;
    using SimplyRecipes.Models.ViewModels.SimplyRecipesUsers;

    public class SimplyRecipesUsersService : ISimplyRecipesUsersService
    {
        private readonly IDeletableEntityRepository<SimplyRecipesUser> simplyRecipesUsersRepository;

        public SimplyRecipesUsersService(IDeletableEntityRepository<SimplyRecipesUser> simplyRecipesUsersRepository)
        {
            this.simplyRecipesUsersRepository = simplyRecipesUsersRepository;
        }

        public async Task<SimplyRecipesUserDetailsViewModel> BanByIdAsync(string id)
        {
            var simplyRecipesUser = await this.simplyRecipesUsersRepository
                .All()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (simplyRecipesUser == null)
            {
                throw new NullReferenceException(
                    string.Format(ExceptionMessages.SimplyRecipesUserNotFound, id));
            }

            this.simplyRecipesUsersRepository.Delete(simplyRecipesUser);
            await this.simplyRecipesUsersRepository.SaveChangesAsync();

            var viewModel = await this.GetViewModelByIdAsync<SimplyRecipesUserDetailsViewModel>(id);

            return viewModel;
        }

        public async Task<SimplyRecipesUserDetailsViewModel> UnbanByIdAsync(string id)
        {
            var simplyRecipesUser = await this.simplyRecipesUsersRepository
                .AllWithDeleted()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (simplyRecipesUser == null)
            {
                throw new NullReferenceException(
                    string.Format(ExceptionMessages.SimplyRecipesUserNotFound, id));
            }

            this.simplyRecipesUsersRepository.Undelete(simplyRecipesUser);
            await this.simplyRecipesUsersRepository.SaveChangesAsync();

            var viewModel = await this.GetViewModelByIdAsync<SimplyRecipesUserDetailsViewModel>(id);

            return viewModel;
        }

        public async Task<IEnumerable<TViewModel>> GetAllSimplyRecipesUsersAsync<TViewModel>()
        {
            var users = await this.simplyRecipesUsersRepository
              .AllWithDeleted()
              .To<TViewModel>()
              .ToListAsync();

            return users;
        }

        public async Task<TViewModel> GetViewModelByIdAsync<TViewModel>(string id)
        {
            var simplyRecipesUserViewModel = await this.simplyRecipesUsersRepository
                .AllWithDeleted()
                .Where(u => u.Id == id)
                .To<TViewModel>()
                .FirstOrDefaultAsync();

            if (simplyRecipesUserViewModel == null)
            {
                throw new NullReferenceException(string.Format(ExceptionMessages.SimplyRecipesUserNotFound, id));
            }

            return simplyRecipesUserViewModel;
        }
    }
}
