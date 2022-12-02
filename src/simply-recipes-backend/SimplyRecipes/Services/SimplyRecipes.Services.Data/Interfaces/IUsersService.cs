namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;

    using SimplyRecipes.Services.Data.Models.Users;

    public interface IUsersService
    {
        Task<UserModel> GetByIdAsync(string id);
    }
}
