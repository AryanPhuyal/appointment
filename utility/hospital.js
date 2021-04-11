const Hospital = require( "../model/Hospital" );
exports.listHospital = async ( name, user, cb ) =>
{
  if ( name ) return listHospitalByName( name, user, cb );
  // Hospital.aggregate( [ { $match: { status: "Active", } }, { $match: { 'likes.user': user } } ] )
  Hospital.find( { status: "Active" }

  )
    // .select( "_id hospitalName address description phone imageUrl likes" )
    // .where( { 'likes.user': user } )
    .then( ( hospitals ) =>
    {
      if ( hospitals )
      {
        for ( i in hospitals )
        {
          element = hospitals[ i ].likes.filter( ( el ) => el.user + '' === user + '' );
          console.log( element );
          hospitals[ i ].likes = element;

        }
        cb( hospitals )
      }
      else
      {
        console.log( "asas" )
        return cb( null );

      }
    } );
};

listHospitalByName = ( name, user, cb ) =>
{
  if ( name == "" || !name )
  {
    return this.listHospital( hospitals =>
    {
      return cb( hospitals );
    } );
  }
  Hospital.find( { hospitalName_lower: name, accountStatus: true } )
    .select( "_id hospitalName address description phone photoUrl" )
    .exec( ( err, hospitals ) =>
    {
      if ( !err ) return cb( hospitals );
      return cb( null );
    } );
};
