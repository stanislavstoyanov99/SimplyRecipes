namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.ArticleComments;
    using SimplyRecipes.Web.Infrastructure.Services;

    public class ArticleCommentsController : ApiController
    {
        private readonly IArticleCommentsService articleCommentsService;
        private readonly ICurrentUserService currentUserService;

        public ArticleCommentsController(
            IArticleCommentsService articleCommentsService,
            ICurrentUserService currentUserService)
        {
            this.articleCommentsService = articleCommentsService;
            this.currentUserService = currentUserService;
        }

        [HttpPost("comment")]
        [ProducesResponseType(typeof(PostArticleCommentViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> Comment([FromBody] CreateArticleCommentInputModel model)
        {
            var parentId = model.ParentId == 0 ? null : model.ParentId;

            if (parentId.HasValue)
            {
                if (!await this.articleCommentsService.IsInArticleId(parentId.Value, model.ArticleId))
                {
                    return this.BadRequest(model);
                }
            }

            var userId = this.currentUserService.GetId();

            try
            {
                var articleComment = await this.articleCommentsService.CreateAsync(
                    model.ArticleId,
                    userId,
                    model.Content.Trim(),
                    parentId);

                return this.Ok(articleComment);
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
    }
}
