namespace SimplyRecipes.Services.Data.Models
{
    using System.Linq;
    using System.Collections.Generic;

    public class ResultModel
    {
        private readonly List<string> errors;

        public ResultModel()
        {
        }

        public ResultModel(bool succeeded, List<string> errors)
        {
            this.Succeeded = succeeded;
            this.errors = errors;
        }

        public virtual bool Succeeded { get; }

        public virtual List<string> Errors
            => this.Succeeded
                ? new List<string>()
                : this.errors;

        public static ResultModel Success
           => new ResultModel(true, new List<string>());

        public static ResultModel Failure(IEnumerable<string> errors)
            => new ResultModel(false, errors.ToList());

        public static implicit operator ResultModel(string error)
            => Failure(new List<string> { error });

        public static implicit operator ResultModel(List<string> errors)
            => Failure(errors.ToList());

        public static implicit operator ResultModel(bool success)
            => success ? Success : Failure(new[] { "Unsuccessful operation." });

        public static implicit operator bool(ResultModel result)
            => result.Succeeded;
    }
}
