import slugify from "slugify";


const slug = (name: string)=>{
      return slugify(name,{lower: true})
}

export default slug;