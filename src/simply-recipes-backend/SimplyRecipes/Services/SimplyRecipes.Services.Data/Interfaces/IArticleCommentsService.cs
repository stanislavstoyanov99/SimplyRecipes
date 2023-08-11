﻿namespace SimplyRecipes.Services.Data.Interfaces
{
    using SimplyRecipes.Models.ViewModels.ArticleComments;
    using System.Threading.Tasks;

    public interface IArticleCommentsService
    {
        Task<PostArticleCommentViewModel> CreateAsync(int articleId, string userId, string content, int? parentId = null);

        Task<bool> IsInArticleId(int commentId, int articleId);

        Task<TViewModel> GetViewModelByIdAsync<TViewModel>(int id);
    }
}
