namespace SimplyRecipes.Data.Models
{
    using System;

    using SimplyRecipes.Data.Common.Models;

    public class FacebookIdentifierLogin : BaseDeletableModel<string>
    {
        public FacebookIdentifierLogin()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public string FacebookIdentifier { get; set; }

        public string UserId { get; set; }

        public virtual SimplyRecipesUser User { get; set; }

    }
}
