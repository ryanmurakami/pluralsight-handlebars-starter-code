(function() {
    var dh = {};

    dh.chooseDog = function(dogId) {
    	var dog = dh.getDog(dogId);
    	if (dog)	{
    		dog.chosen = 'dog';
    		dh.storeDogs(dh.dogs);
    	}
    };

    dh.chooseNotDog = function(dogId) {
    	var dog = dh.getDog(dogId);
    	if (dog)	{
    		dog.chosen = 'not dog';
    		dh.storeDogs(dh.dogs);
    	}
    };

    dh.getDog = function(dogId) {
    	var dog;
    	dh.dogs.forEach(function(val) {
    		if (val.id === dogId) {
    			dog = val;
    		}
    	});
    	return dog;
    };

    dh.isMaybeDog = function(dog) {
    	return !dog.chosen ||
    		(dog.isDog && dog.chosen !== 'dog') ||
    		(!dog.isDog && dog.chosen !== 'not dog');
    };

    dh.isRightDog = function(dog) {
    	return dog.isDog && dog.chosen === 'dog';
    };

    dh.isRightNotDog = function(dog) {
    	return !dog.isDog && dog.chosen === 'not dog';
    };

    dh.getNumberOfDogs = function() {
      var dogWidth = 320,
          dogsPadding = 80;
      return Math.floor((window.innerWidth - dogsPadding) / dogWidth) * 2;
    };

    dh.getPaginatedDogs = function(dogs) {
      var params = DogPack.parseUrl(),
          dogPage = params.page || 1,
    			dogCount = dh.getNumberOfDogs(),
    			start = (dogPage - 1) * dogCount,
    			stop = dogPage * dogCount;
      return dogs.slice(start, stop);
    };

    dh.getFilteredDogs = function(dogs) {
      var params = DogPack.parseUrl(),
          tempDogs = dogs;
      if(params.filter) {
    		tempDogs = dogs.filter(function(dog) {
    			switch(params.filter) {
    				case 'dogs':
    					return DogPack.isRightDog(dog);
    				case 'not_dogs':
    					return DogPack.isRightNotDog(dog);
    				case 'maybe_dogs':
    					return DogPack.isMaybeDog(dog);
    				default:
    					return false;
    			}
    		});
    	}
      return tempDogs;
    };

    function Dog(id, image, name, isDog, chosen) {
      this.id = id;
      this.image = image;
      this.name = name;
      this.isDog = isDog;
      this.chosen = chosen;
      this.isCorrect = function() {
        return (this.chosen === 'dog' && this.isDog) ||
      		(this.chosen === 'not dog' && !this.isDog);
      }
      return this;
    }

    dh.initDogs = function() {
    	var dogs = [
        new Dog('goofy', 'goofy_dog.jpg', 'Goofy', true),
    		new Dog('baby', 'bubby_bunny.jpg', 'Baby', false),
    	  new Dog('bunny', 'bunny_dog.jpg', 'Bunny', true),
    		new Dog('caged', 'caged_heat.jpg', 'Caged Heat', false),
    		new Dog('cloudy', 'cloudy_bunny.jpg', 'Cloudy', false),
    		new Dog('curious', 'curious_pig.jpg', 'Curious', false),
    		new Dog('bootsy', 'cute_otter.jpg', 'Bootsy', false),
    		new Dog('chillin', 'dgaf_dog.jpg', 'Chillin\'', true),
    		new Dog('posessed', 'exorcist_dog.jpg', 'Possessed', true),
    		new Dog('gremlin', 'gremlin_dog.jpg', 'Gremlin', true),
    		new Dog('zen', 'meditating_cat.jpg', 'Zen', false),
    		new Dog('friendly', 'middlefinger_otter.jpg', 'Wassup', false),
    		new Dog('moonwalker', 'moonwalking_goat.jpg', 'Moonwalking', false),
        new Dog('panda', 'panda_dog.jpg', 'Panda', true),
    		new Dog('party', 'party_dog.jpg', 'Partytime', true),
    		new Dog('sad', 'sad_pony.jpg', 'Sad', false),
    		new Dog('salary', 'salary_dog.jpg', 'Salaryman', true),
    		new Dog('surprised', 'startled_dog.jpg', 'Surprised', true),
    		new Dog('teacup', 'teacup_pig.jpg', 'Red Boots', false),
    		new Dog('towel', 'towel_dog.jpg', 'Towel Dry', true),
    		new Dog('triple', 'triplethreat_dog.jpg', 'Triple Threat', true),
    		new Dog('happy', 'ultimate_quokka.jpg', 'Happy', false)
    	];
    	if (window.localStorage.getItem('dogs')) {
    		return dh.rehydrateDogs(JSON.parse(window.localStorage.getItem('dogs')));
    	} else {
    		dh.storeDogs(dogs);
    		return dogs;
    	}
    };

    dh.rehydrateDogs = function(bunchaDogs) {
      var backatchaDogs = [];
      bunchaDogs.forEach(function(val) {
        backatchaDogs.push(new Dog(val.id,
          val.image, val.name, val.isDog, val.chosen));
      });
      return backatchaDogs;
    };

    dh.storeDogs = function(someDogs) {
    	window.localStorage.setItem('dogs', JSON.stringify(someDogs));
    };

    dh.clearDogs = function() {
    	window.localStorage.removeItem('dogs');
      dh.dogs = dh.initDogs();
    };

    dh.scoreDogs = function(dogs) {
      var correct = 0,
          incorrect = 0,
          incomplete = dogs.length;
      $.each(dogs, function(ix, dog) {
        if (dog.chosen) {
          incomplete--;
          if (dog.isCorrect()) {
            correct++;
          } else {
            incorrect++;
          }
        }
      });
      return {
        correct: correct,
        incorrect: incorrect,
        incomplete: incomplete
      };
    };

    dh.parseUrl = function() {
    	var queryParams = window.location.search.slice(1).split('&'),
    	    paramsObj = {};
    	queryParams.forEach(function(val) {
    		if (val) {
    			paramsObj[val.split('=')[0]] = val.split('=')[1];
    		}
    	});
    	return paramsObj;
    };

    dh.generateUrlParameters = function(excludes) {
      var queryParams = dh.parseUrl(),
          returnString = '?';
      for (var key in queryParams) {
        if (!excludes || excludes.indexOf(key) < 0) {
          returnString += key + '=' + queryParams[key] + '&';
        }
      }
      return returnString;
    };

    dh.switchLanguage = function() {
      var lang = window.language.langId === 'human' ?
            'dog' : 'human',
          filters = dh.generateUrlParameters(['language']);
  		window.location.href = filters + 'language=' + lang;
    };

    dh.initLanguages = function(lang) {
      var human = {
            langId: 'human',
            siteTitle: 'dog or not?',
            dogsFilter: 'dogs',
            notDogsFilter: 'not dogs',
            incompleteFilter: 'maybe dogs',
            languageFilter: 'dog?',
            languageFilterId: 'dog',
            reset: 'reset',
            correct: 'correct',
            incorrect: 'incorrect',
            incomplete: 'incomplete',
            yep: 'Dog',
            nope: 'Not',
            correctInd: 'Correct!',
            incorrectInd: 'Try Again!',
            noDogsMessage: 'Sorry! There are no dogs here...'
          },
          dog = {
            langId: 'dog',
            siteTitle: 'Roof? Grrr!',
            dogsFilter: 'roof',
            notDogsFilter: 'grrr',
            incompleteFilter: 'aroo?',
            languageFilter: 'human?',
            languageFilterId: 'human',
            reset: 'ruhuh',
            correct: 'aroo!',
            incorrect: 'yipe!',
            incomplete: 'pant!',
            yep: 'aroo',
            nope: 'grrr',
            correctInd: 'Aroo!',
            incorrectInd: 'Yipe!',
            noDogsMessage: 'Ruh-roh! Woof woof whine...'
          },
          languageFilter = dh.parseUrl();
      if ((lang || languageFilter.language) === 'dog') {
        return dog;
      } else {
        return human;
      }
    };

    dh.dogs = dh.initDogs();

    window.language = dh.initLanguages();
    window.DogPack = dh;
})();
