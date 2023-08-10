namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;
    using CloudinaryDotNet;
    using Microsoft.AspNetCore.Http;

    public interface ICloudinaryService
    {
        Task<string> UploadAsync(IFormFile file, string fileName);

        Task DeleteImageAsync(Cloudinary cloudinary, string name);
    }
}
