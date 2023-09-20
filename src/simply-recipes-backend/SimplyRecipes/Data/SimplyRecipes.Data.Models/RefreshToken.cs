namespace SimplyRecipes.Data.Models
{
    using System;

    using SimplyRecipes.Data.Common.Models;

    public class RefreshToken : BaseModel<int>
    {
        public string Token { get; set; }

        public DateTime ExpirationDate { get; set; }

        public string CreatedByIp { get; set; }

        public DateTime? RevokedDate { get; set; }

        public string RevokedByIp { get; set; }

        public string ReplacedByToken { get; set; }

        public string ReasonRevoked { get; set; }

        public string UserId { get; set; }

        public virtual SimplyRecipesUser User { get; set; }

        public bool IsExpired => DateTime.UtcNow >= ExpirationDate;

        public bool IsRevoked => RevokedDate != null;

        public bool IsActive => !IsRevoked && !IsExpired;
    }
}
