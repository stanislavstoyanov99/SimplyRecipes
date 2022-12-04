﻿namespace SimplyRecipes.Services.Data.Interfaces
{
    using System.Threading.Tasks;

    public interface IArticleCommentsService
    {
        Task CreateAsync(int articleId, string userId, string content, int? parentId = null);

        Task<bool> IsInArticleId(int commentId, int articleId);
    }
}
