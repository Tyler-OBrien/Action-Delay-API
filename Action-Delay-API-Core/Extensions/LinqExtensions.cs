using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Extensions
{
    // https://stackoverflow.com/a/76253452
    public static class LinqExtensions
    {

        public static TSource Median<TSource>(this IEnumerable<TSource> source)
            where TSource : struct, INumber<TSource>
            => Median<TSource, TSource>(source);

        public static TResult Median<TSource, TResult>(this IEnumerable<TSource> source)
            where TSource : struct, INumber<TSource>
            where TResult : struct, INumber<TResult>
        {
            var array = source.ToArray();
            var count = array.Length;
            if (count == 0)
            {
                throw new InvalidOperationException("Sequence contains no elements.");
            }
            Array.Sort(array);
            var index = count / 2;
            var value = TResult.CreateChecked(array[index]);
            if (count % 2 == 1)
            {
                return value;
            }
            var sum = value + TResult.CreateChecked(array[index - 1]);
            return sum / TResult.CreateChecked(2);
        }
    }
}
