namespace SimplyRecipes.Web.Controllers
{
    using System;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;

    using SimplyRecipes.Data.Models;
    using SimplyRecipes.Services.Data.Interfaces;
    using SimplyRecipes.Models.ViewModels.ArticleComments;

    public class ArticleCommentsController : ApiController
    {
        private readonly IArticleCommentsService articleCommentsService;
        private readonly UserManager<SimplyRecipesUser> userManager;

        public ArticleCommentsController(
            IArticleCommentsService articleCommentsService,
            UserManager<SimplyRecipesUser> userManager)
        {
            this.articleCommentsService = articleCommentsService;
            this.userManager = userManager;
        }

        [HttpPost("comment")]
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

            var userId = this.userManager.GetUserId(this.User);

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
