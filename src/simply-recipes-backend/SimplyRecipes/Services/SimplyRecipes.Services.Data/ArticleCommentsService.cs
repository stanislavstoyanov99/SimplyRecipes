namespace SimplyRecipes.Services.Data
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;

    using SimplyRecipes.Data.Common.Repositories;
    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Common;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Services.Mapping;
    using SimplyRecipes.Models.ViewModels.ArticleComments;

    using Microsoft.EntityFrameworkCore;

    public class ArticleCommentsService : IArticleCommentsService
    {
        private readonly IDeletableEntityRepository<ArticleComment> articleCommentsRepository;

        public ArticleCommentsService(IDeletableEntityRepository<ArticleComment> articleCommentsrepository)
        {
            this.articleCommentsRepository = articleCommentsrepository;
        }

        public async Task<PostArticleCommentViewModel> CreateAsync(
            int articleId, string userId, string content, int? parentId = null)
        {
            var articleComment = new ArticleComment
            {
                ArticleId = articleId,
                UserId = userId,
                Content = content,
                ParentId = parentId,
            };

            bool doesArticleCommentExist = await this.articleCommentsRepository
                .All()
                .AnyAsync(x => x.ArticleId == articleComment.ArticleId && x.UserId == userId && x.Content == content);
            if (doesArticleCommentExist)
            {
                throw new ArgumentException(
                    string.Format(ExceptionMessages.ArticleCommentAlreadyExists, articleComment.ArticleId, articleComment.Content));
            }

            await this.articleCommentsRepository.AddAsync(articleComment);
            await this.articleCommentsRepository.SaveChangesAsync();

            var viewModel = await this.GetViewModelByIdAsync<PostArticleCommentViewModel>(articleComment.Id);

            return viewModel;
        }

        public async Task<bool> IsInArticleId(int commentId, int articleId)
        {
            var commentArticleId = await this.articleCommentsRepository
                .All()
                .Where(x => x.Id == commentId)
                .Select(x => x.ArticleId)
                .FirstOrDefaultAsync();

            return commentArticleId == articleId;
        }

        public async Task<TViewModel> GetViewModelByIdAsync<TViewModel>(int id)
        {
            var articleCommentViewModel = await this.articleCommentsRepository
                .All()
                .Where(a => a.Id == id)
                .To<TViewModel>()
                .FirstOrDefaultAsync();

            if (articleCommentViewModel == null)
            {
                throw new NullReferenceException(string.Format(ExceptionMessages.ArticleCommentNotFound, id));
            }

            return articleCommentViewModel;
        }

    }
}
