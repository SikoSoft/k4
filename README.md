# K4

Any year I sell crypto, I have to file it on my tax return (so I don't go to jail). In Sweden, part of this involves attaching an additional form: K4. The Swedish tax authority, Skatteverket, provides a PDF version of this form, but does not allow you to submit an edited PDF version back to them. Nor do they bother providing a web tool to provide the information in a streamlined and frictionless manner.

No, they expect you provide this data to them in an obscure (to me at least) file format: .sru. This format is supposedly standard, or at least common, with a lot of book keeping software. Since I don't have any book keeping software, and am not familiar with the format, I get stuck paying a website 500 SEK (about $50) every time just to use their web form. And it's a simple form with not a lot of input, and nothing overly complex about it.

Arguably, the real value is in the conversion of the data to the expected file format. When I looked at the files I got after paying the site I've used, I noticed the .sru files are plain text.

I said to myself, what is so special or complicated about what's involved here that I can't make my own form to do the same thing?

So that's what I am doing here, re-creating this stupid tax form so I don't have to pay some other jack-ass 500 kronor to use their form.

It's a bit undecided at the moment whether I will completely open source this or be another jack-ass to charge people to use what Skatteverket should just provide for free.

### tests to add:

count number of columns in every single row
count number of rows in every section
check mapping
