import "./Categories.css";

const categories = [

  "All",
  "Music",
  "Gaming",
  "Education",
  "Sports",
  "Technology",
  "Live",
  "Shorts",
  "Programming",
  "Comedy",
  "Movies",
  "News",
  "Fashion",
  "Travel",
  "Food",
  "Health",
  "Science",
  "Animals",
  "DIY",
  "Animation",
  "Vlogs",
  "Podcasts",

];

const Categories = ({
  selectedCategory,
  setSelectedCategory
}) => {

  return (

    <div className="categories">

      {categories.map((category) => (

        <button
          key={category}
          className={
            selectedCategory === category
            ? "active-category"
            : ""
          }

          onClick={() =>
            setSelectedCategory(category)
          }
        >

          {category}

        </button>

      ))}

    </div>

  );

};

export default Categories;