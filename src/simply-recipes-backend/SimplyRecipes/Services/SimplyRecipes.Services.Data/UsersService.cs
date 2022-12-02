namespace SimplyRecipes.Services.Data
{
    using System.Threading.Tasks;

    using Microsoft.EntityFrameworkCore;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Data.Models.Users;

    public class UsersService : IUsersService
    {
        private readonly IDeletableEntityRepository<SimplyRecipesUser> users;

        public UsersService(IDeletableEntityRepository<SimplyRecipesUser> users)
        {
            this.users = users;
        }

        public async Task<UserModel> GetByIdAsync(string id)
        {
            var user = await this.users
                .All()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                return null;
            }

            var userModel = new UserModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                AvatarPath = user.AvatarPath
            };

            return userModel;
        }
    }
}
