const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const { page = 1 } = request.query; // esquema de paginação

        const [count] = await connection('incidents')
            .count();
        
        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5) // paginação primeira página
            .select([
                'incidents.*', // todos do incidents
                'ongs.name', 
                'ongs.email',
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
            ]); // nao seleciona a id da ong para não sobrepor a id do incidente

        response.header('X-Total-Count', count['count(*)']); // console.log(count) só que no insomnia

        return response.json(incidents);
    },

    async create(request, response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        if(incident.ong_id != ong_id){
            return response.status(401).json({ // unauthorized
                error: 'Operation not permitted.'
            });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send(); // no content
    }
};